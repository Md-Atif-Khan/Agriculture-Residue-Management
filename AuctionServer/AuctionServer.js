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

            const endTime = new Date(room.endDate).getTime();
            const currentTime = new Date().getTime();

            if (currentTime >= endTime) {
                console.log("Auction already ended for room:", data.code);
                socket.emit("auction_ended");
            } else {
                const timeLeft = endTime - currentTime;
                console.log(`Auction time remaining for room ${data.code}: ${Math.floor(timeLeft/1000/60)} minutes`);
                
                // Send time remaining to client
                socket.emit("time_remaining", timeLeft);
                
                if (auctionTimers[data.code]) {
                    clearTimeout(auctionTimers[data.code]);
                }
                auctionTimers[data.code] = setTimeout(() => {
                    console.log(`Auction timer ended for room ${data.code}`);
                    io.to(data.code).emit("auction_ended");
                    endAuction(data.code);
                }, timeLeft);
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

        // Check if auction is still active
        if (new Date() >= new Date(room.endDate)) {
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
    console.log(`Ending auction for room ${roomCode}`);
    
    if (auctionTimers[roomCode]) {
        clearTimeout(auctionTimers[roomCode]);
        delete auctionTimers[roomCode];
        console.log(`Cleared timer for room ${roomCode}`);
    }
    
    try {
        // Get room details
        const room = await RoomModel.findOne({ code: roomCode });
        if (!room) {
            console.error(`Room ${roomCode} not found`);
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