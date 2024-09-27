const express = require('express');
const app = express();
const http = require('http');
const AuctionServer = http.createServer(app);
const { Server } = require('socket.io');
const AuctionModel = require('../models/Auction');
const RoomModel = require('../models/AuctionRoom');
const connectDB = require('../config/db');
const cookieParser = require('cookie-parser');

connectDB();
app.use(cookieParser());
app.use(express.json());

const io = new Server(AuctionServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const auctionTimers = {};

io.on('connection', (socket) => {
  console.log("A user is Connected", socket.id);

  socket.on("join room", async (data) => {
    console.log("Room code is ", data.Code);
    let room = await RoomModel.findOne({ Code: data.Code });
    if (room) {
      console.log("Joined Successfully");
      socket.join(data.Code);
      socket.emit("startDetails", room);

      const endTime = new Date(room.endDate).getTime();
      const currentTime = new Date().getTime();

      if (currentTime >= endTime) {
        socket.emit("auction_ended");
      }else {
        const timeLeft = endTime - currentTime;
        if (auctionTimers[data.Code]) {
          clearTimeout(auctionTimers[data.Code]);
        }
        auctionTimers[data.Code] = setTimeout(() => {
          io.to(data.Code).emit("auction_ended");
          endAuction(data.Code);
        }, timeLeft);
      }

      let startingBid = await AuctionModel.findOne({ Room: data.Code });
      socket.emit("starting_bid", startingBid ? startingBid.Bid : 0);

      let latestBid = await AuctionModel.findOne({ Room: data.Code }).sort({ _id: -1 });
      if (latestBid) {
        socket.emit("curr_bid", latestBid);
      }

      let recentBids = await AuctionModel.find({ Room: data.Code }).sort({ _id: -1 }).limit(3);
      socket.emit("bids", recentBids.reverse());
    }
    else {
      socket.emit("room_error", data.Code);
    }
  });

  socket.on('send_bid', async (data) => {
    if (!data.user) {
      socket.emit("auth_error", { msg: "User does not exist!" });
      return;
    }

    let room = await RoomModel.findOne({ Code: data.Code });
    if (!room || new Date() >= new Date(room.endDate)) {
      socket.emit("error_bid", { message: "Auction has ended or does not exist" });
      return;
    }

    let latestBid = await AuctionModel.findOne({ Room: data.Code }).sort({ _id: -1 });
    if (!latestBid || latestBid.Bid < data.bid) {
      let newBid = await AuctionModel.create({ Bid: data.bid, User: data.user, Room: data.Code });
      io.to(data.Code).emit('receive_bid', newBid);
      io.to(data.Code).emit("curr_bid", newBid);
    }
    else {
      socket.emit("error_bid", { message: "Bid must be higher than the current highest bid" });
    }
  });

  socket.on('disconnect', () => {
    console.log("User disconnected", socket.id);
  });
});

function endAuction(roomCode) {
  if (auctionTimers[roomCode]) {
    clearTimeout(auctionTimers[roomCode]);
    delete auctionTimers[roomCode];
  }
}

// module.exports = AuctionServer;
AUCTION_SERVER_PORT = 8001 || process.env.AUCTION_SERVER_PORT;
AuctionServer.listen(AUCTION_SERVER_PORT, () => {
    console.log(`Auction Server is Runnig at port ${AUCTION_SERVER_PORT}`);
});