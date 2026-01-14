require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const AuctionServer = http.createServer(app);
const { Server } = require('socket.io');
const AuctionModel = require('./models/Auction');
const RoomModel = require('./models/AuctionRoom');
const User = require('./models/User');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { sendWinnerNotification, sendAdminAuctionEndNotification } = require('./utils/email');

// Define the schema for room participants if it doesn't exist elsewhere
const RoomParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    roomCode: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model if it doesn't already exist
const RoomParticipation = mongoose.models.RoomParticipation || mongoose.model('RoomParticipation', RoomParticipationSchema);

connectDB();
app.use(cookieParser());
app.use(express.json());

// Add a health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Auction server is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const io = new Server(AuctionServer, {
    cors: {
        origin: ["http://localhost:3000", "https://agriculture-residue-management.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header", "Content-Type", "Authorization"],
        credentials: true
    }
});

const auctionTimers = {};
const roomParticipants = {}; // Track online participants per room
const endingAuctions = new Set(); // Track auctions currently being ended to prevent duplicates
const MAX_TIMEOUT = 2147483647; // JavaScript setTimeout max safe value (about 24.8 days)

// Get actual participant count from database
async function getParticipantCount(roomCode) {
    try {
        const count = await RoomParticipation.countDocuments({ roomCode });
        console.log(`Room ${roomCode} has ${count} registered participants`);
        return count;
    } catch (err) {
        console.error(`Error getting participant count for room ${roomCode}:`, err);
        return 0;
    }
}

// Periodic cleanup function to check and end expired auctions
async function checkAndEndExpiredAuctions() {
    try {
        const currentTime = Date.now();

        // Find all rooms that have expired
        const expiredRooms = await RoomModel.find({
            endDate: { $lt: new Date(currentTime) }
        });

        if (expiredRooms.length > 0) {
            console.log(`Found ${expiredRooms.length} expired auction(s) to clean up`);

            for (const room of expiredRooms) {
                console.log(`Ending expired auction: ${room.name} (code: ${room.code})`);

                // Emit auction_ended event to all connected clients in this room
                io.to(room.code).emit("auction_ended");

                // End the auction and clean up
                await endAuction(room.code);
            }
        }
    } catch (err) {
        console.error('Error in periodic auction cleanup:', err);
    }
}

// Run cleanup immediately on server start
checkAndEndExpiredAuctions();

// Set up periodic cleanup - run every 5 minutes (300000 ms)
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(checkAndEndExpiredAuctions, CLEANUP_INTERVAL);
console.log(`Periodic auction cleanup scheduled to run every ${CLEANUP_INTERVAL / 60000} minutes`);

io.on('connection', (socket) => {
    console.log("A user is Connected", socket.id);

    socket.on("join room", async (data) => {
        console.log("Join room request received:", data);
        
        if (!data || !data.code) {
            console.log("Invalid join room request: missing room code");
            socket.emit("room_error", "Missing room code");
            return;
        }
        
        console.log("Room code is ", data.code);
        let room = await RoomModel.findOne({ code: data.code });

        if (room) {
            console.log("Room found, details:", {
                name: room.name,
                code: room.code,
                startDate: room.startDate,
                endDate: room.endDate
            });
            
            console.log("Joined Successfully");
            socket.join(data.code); 
            
            // Track online participants
            if (!roomParticipants[data.code]) {
                roomParticipants[data.code] = new Set();
            }
            roomParticipants[data.code].add(socket.id);
            
            // Get actual participant count from database
            const participantCount = await getParticipantCount(data.code);
            
            // Update participant count for all users in the room
            io.to(data.code).emit("participant_count", participantCount);
            
            // Add participant count to room details
            room = room.toObject();
            room.participants = participantCount;
            
            socket.emit("startDetails", room);

            // Convert both dates to UTC timestamps for accurate comparison
            const endTime = new Date(room.endDate).getTime();
            const currentTime = Date.now();

            // Debug logging
            console.log(`Room ${data.code} date comparison:`, {
                endDate: room.endDate,
                endTime: endTime,
                currentTime: currentTime,
                endDateString: new Date(room.endDate).toISOString(),
                currentDateString: new Date(currentTime).toISOString(),
                hasEnded: currentTime >= endTime
            });

            if (currentTime >= endTime) {
                console.log("Auction already ended for room:", data.code);
                socket.emit("auction_ended");
                // Clean up this expired auction
                await endAuction(data.code);
            } else {
                const timeLeft = endTime - currentTime;
                console.log(`Auction time remaining for room ${data.code}: ${Math.floor(timeLeft/1000/60)} minutes`);

                // Send time remaining to client
                socket.emit("time_remaining", timeLeft);

                // Clear any existing timer for this room
                if (auctionTimers[data.code]) {
                    clearTimeout(auctionTimers[data.code]);
                }

                // Only set setTimeout if auction ends within safe timeout period (24.8 days)
                if (timeLeft <= MAX_TIMEOUT) {
                    auctionTimers[data.code] = setTimeout(() => {
                        console.log(`Auction timer ended for room ${data.code}`);
                        io.to(data.code).emit("auction_ended");
                        endAuction(data.code);
                    }, timeLeft);
                    console.log(`Timer set for room ${data.code} to end in ${Math.floor(timeLeft/1000/60)} minutes`);
                } else {
                    console.log(`Auction for room ${data.code} ends in ${Math.floor(timeLeft/1000/60/60/24)} days - will be handled by periodic cleanup`);
                }
            }

            let startingBid = await AuctionModel.findOne({ room: data.code });
            console.log("Starting bid:", startingBid ? startingBid.bid : 0);
            socket.emit("starting_bid", startingBid ? startingBid.bid : 0);

            let latestBid = await AuctionModel.findOne({ room: data.code }).sort({ _id: -1 });
            if (latestBid) {
                console.log("Latest bid:", latestBid);
                socket.emit("curr_bid", latestBid);
            }

            // Get recent bids with proper sorting and include timestamp
            let recentBids = await AuctionModel.find({ room: data.code })
                .sort({ createdAt: -1 })
                .limit(10);
                
            console.log("Recent bids:", recentBids.length);
            socket.emit("bids", recentBids);
        } else {
            console.log("Room not found with code:", data.code);
            socket.emit("room_error", data.code);
        }
    });

    // Listen for join events from the API
    socket.on('room_joined', async (data) => {
        if (data && data.code) {
            const participantCount = await getParticipantCount(data.code);
            io.to(data.code).emit("participant_count", participantCount);
        }
    });

    socket.on('send_bid', async (data) => {
        console.log("Received bid request:", {
            user: data.user,
            userName: data.userName,
            bid: data.bid,
            room: data.code
        });
        
        if (!data.user) {
            socket.emit("auth_error", { msg: "You must be logged in to place a bid" });
            return;
        }

        // Verify room exists
        let room = await RoomModel.findOne({ code: data.code });
        if (!room) {
            socket.emit("error_bid", { message: "Auction room not found" });
            return;
        }

        // Check if auction is still active using UTC timestamps
        const currentTime = Date.now();
        const endTime = new Date(room.endDate).getTime();

        console.log(`Bid validation for room ${data.code}:`, {
            currentTime: currentTime,
            endTime: endTime,
            currentDateString: new Date(currentTime).toISOString(),
            endDateString: new Date(room.endDate).toISOString(),
            hasEnded: currentTime >= endTime
        });

        if (currentTime >= endTime) {
            console.log(`Bid rejected: auction has ended for room ${data.code}`);
            socket.emit("error_bid", { message: "This auction has ended" });
            return;
        }

        // Validate bid amount
        if (!data.bid || isNaN(data.bid) || data.bid <= 0) {
            socket.emit("error_bid", { message: "Invalid bid amount" });
            return;
        }

        // Get latest bid for comparison
        let latestBid = await AuctionModel.findOne({ room: data.code }).sort({ _id: -1 });
        
        // Ensure bid is higher than current highest bid
        if (latestBid && latestBid.bid >= data.bid) {
            socket.emit("error_bid", { message: `Your bid must be higher than the current bid of ₹${latestBid.bid}` });
            return;
        }

        try {
            // Make sure we have a valid username
            const displayName = data.userName || 'Anonymous';
            
            // Store the exact user ID string
            const userId = String(data.user);

            console.log(`Creating new bid with userId '${userId}' (type: ${typeof userId}), displayName: ${displayName}`);

            // Create new bid record in database
            let newBid = await AuctionModel.create({ 
                bid: data.bid,
                user: userId,
                userName: displayName,
                room: data.code
            });
            
            console.log("New bid created in DB:", {
                id: newBid._id,
                user: newBid.user,
                userName: newBid.userName,
                bid: newBid.bid
            });

            // Broadcast bid to all users in the room
            io.to(data.code).emit('receive_bid', newBid);
            
            // Update current highest bid
            io.to(data.code).emit("curr_bid", newBid);
            
            console.log(`New bid: ₹${data.bid} by ${displayName} (${userId}) in room ${data.code}`);
        } catch (error) {
            console.error("Database error:", error);
            socket.emit("error_bid", { message: "Server error occurred while placing bid" });
        }
    });

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id);
        
        // Update online users count when users disconnect
        for (const roomCode in roomParticipants) {
            if (roomParticipants[roomCode].has(socket.id)) {
                roomParticipants[roomCode].delete(socket.id);
                // We don't update participant count here, as it counts registered participants, not online users
            }
        }
    });
});

// Add a new endpoint to get room info
app.get('/api/rooms/join', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ success: false, msg: 'Room code is required' });
        }
        
        console.log("REST API: Get room info for code:", code);
        const room = await RoomModel.findOne({ code });
        
        if (!room) {
            return res.status(404).json({ success: false, msg: 'Room not found' });
        }
        
        return res.json({
            success: true,
            room
        });
    } catch (err) {
        console.error("Error getting room:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

// Better auction end function with cleanup
async function endAuction(roomCode) {
    // Prevent duplicate end processes for the same room
    if (endingAuctions.has(roomCode)) {
        console.log(`Auction ${roomCode} is already being ended, skipping duplicate`);
        return;
    }

    console.log(`Ending auction for room ${roomCode}`);
    endingAuctions.add(roomCode);

    // Clear any existing timer
    if (auctionTimers[roomCode]) {
        clearTimeout(auctionTimers[roomCode]);
        delete auctionTimers[roomCode];
        console.log(`Cleared timer for room ${roomCode}`);
    }

    try {
        // Get room details
        const room = await RoomModel.findOne({ code: roomCode });
        if (!room) {
            console.log(`Room ${roomCode} not found (may have already been cleaned up)`);
            endingAuctions.delete(roomCode);
            return;
        }

        // Get highest bid
        const highestBid = await AuctionModel.findOne({ room: roomCode }).sort({ bid: -1 }).limit(1);
        
        if (highestBid) {
            console.log(`Auction ended. Winner: ${highestBid.userName || highestBid.user}, Amount: ${highestBid.bid}`);
            
            // Get winner's email from User model
            const winner = await User.findById(highestBid.user);
            const winnerEmail = winner ? winner.email : null;
            
            // Get admin email
            const admin = await Admin.findOne({});
            const adminEmail = admin ? admin.email : process.env.ADMIN_EMAIL;

            // Send notifications
            if (winnerEmail) {
                try {
                    await sendWinnerNotification(
                        winnerEmail,
                        highestBid.userName || 'User',
                        highestBid.bid,
                        room.name
                    );
                } catch (emailError) {
                    console.error('Error sending winner notification:', emailError);
                }
            }

            if (adminEmail) {
                try {
                    await sendAdminAuctionEndNotification(
                        adminEmail,
                        highestBid.userName || 'User',
                        winnerEmail || 'No email available',
                        highestBid.bid,
                        room.name
                    );
                } catch (emailError) {
                    console.error('Error sending admin notification:', emailError);
                }
            }

            // Notify all users about the winner
            io.to(roomCode).emit('auction_winner', {
                user: highestBid.user,
                userName: highestBid.userName || 'Anonymous',
                bid: highestBid.bid
            });

            // Delete the auction room
            await RoomModel.deleteOne({ code: roomCode });
            console.log(`Auction room ${roomCode} deleted successfully`);
        } else {
            console.log(`Auction ended with no bids for room ${roomCode}`);
            io.to(roomCode).emit('auction_ended', { message: 'Auction ended with no bids' });
            
            // Delete the auction room even if there were no bids
            await RoomModel.deleteOne({ code: roomCode });
            console.log(`Auction room ${roomCode} deleted successfully`);
        }
    } catch (err) {
        console.error(`Error in endAuction for room ${roomCode}:`, err);
        io.to(roomCode).emit('auction_error', { message: 'Error determining auction winner' });
    } finally {
        // Always remove from tracking set when done
        endingAuctions.delete(roomCode);
    }
}

// Testing routes to help debug auction issues
app.get('/api/test/rooms', async (req, res) => {
    try {
        const rooms = await RoomModel.find();
        res.json({
            success: true,
            count: rooms.length,
            rooms: rooms.map(room => ({
                id: room._id,
                name: room.name,
                code: room.code,
                startDate: room.startDate,
                endDate: room.endDate,
                startBid: room.startBid
            }))
        });
    } catch (err) {
        console.error("Error fetching test rooms:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

app.post('/api/test/rooms', async (req, res) => {
    try {
        // Generate a random code if not provided
        const code = req.body.code || Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const newRoom = await RoomModel.create({
            name: req.body.name || 'Test Auction Room',
            code: code,
            description: req.body.description || 'This is a test auction room',
            startBid: req.body.startBid || 100,
            startDate: req.body.startDate || new Date(),
            endDate: req.body.endDate || new Date(Date.now() + 3600000) // 1 hour from now
        });
        
        // Create initial bid with proper name
        await AuctionModel.create({
            bid: newRoom.startBid,
            user: "Admin",
            userName: "Admin (System)",
            room: newRoom.code
        });
        
        res.status(201).json({
            success: true,
            msg: 'Test room created successfully',
            room: newRoom
        });
    } catch (err) {
        console.error("Error creating test room:", err);
        res.status(500).json({ success: false, msg: 'Server error: ' + err.message });
    }
});

app.get('/api/test/bids/:roomCode', async (req, res) => {
    try {
        const bids = await AuctionModel.find({ room: req.params.roomCode }).sort({ _id: -1 });
        res.json({
            success: true,
            count: bids.length,
            bids
        });
    } catch (err) {
        console.error("Error fetching bids:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

// Set the PORT environment variable
const PORT = process.env.PORT || 8001;
AuctionServer.listen(PORT, () => {
    console.log(`Auction Server is running on port ${PORT}`);
}); 