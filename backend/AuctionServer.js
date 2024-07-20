const express = require('express');
const app = express();

const http = require('http');
const AuctionServer = http.createServer(app);

const {Server} = require('socket.io');

const AuctionModel = require('./models/Auction');
const RoomModel = require('./models/AuctionRoom');

const MAX_SOCKETS_PER_TAB = 2;
const socketsPerTab = {};

// const io cannnot emit to all sockets in room so make  it global by var 
const io = new Server(AuctionServer,{
    cors :{
        origin : "*",
        methods : ["GET","POST"],
        allowedHeaders : ["my-custom-header"],
        credentials : true
    }
});

io.on('connection',(socket)=>{

    const { id: socketId } = socket;
  const { tabId } = socket.handshake.query;

    socketsPerTab[tabId] = socketsPerTab[tabId] || 0;
  socketsPerTab[tabId]++;
  console.log("A user is Connected", socket.id);


  // if (socketsPerTab[tabId] > MAX_SOCKETS_PER_TAB) {
  //       socket.disconnect();
  //       return;
  //     }
    
      // // Otherwise, add the socket to the room
      // socket.join('roomName');
      
      // When the socket disconnects, decrement the number of sockets for the tab
      socket.on('disconnect', () => {
        socketsPerTab[tabId]--;
      });

  socket.on("join room",async(data)=>{
    console.log("Room code is ",data);
    let resp = await RoomModel.findOne({Code : data.Code});
    console.log(resp);
    if(resp){
      console.log("Joined Successfully");
      socket.join(data.Code);
      socket.emit("startDetails",resp);

      //Find first bid by admin and send as starting bid
      let respon = await AuctionModel.findOne({Room :data.Code});
      if(respon)
      {
        socket.emit("starting_bid",respon.Bid);
      }
      else{
        socket.emit("starting_bid",0);
      }
      //latest bid is Current Highest bid
      let res = await AuctionModel.find({Room:data.Code}).sort({_id:-1}).limit(1);
      if(res)
     {
      console.log(res[0],"This is what we are sending");
      socket.emit("curr_bid",res[0]);
    //  res[0].Bid
    } 
     else{
        socket.emit("curr_bid",0);
      }
      //provide latest three bids

      let response = await AuctionModel.find({Room : data.Code}).sort({_id:-1}).limit(3);
      response.reverse();
      socket.emit("bids",[...response]);
    }
    else{
      socket.emit("room_error",data.Code);
      // await RoomModel.create({Name :"first",Code : data.Code});
      console.log("Enter valid Room code");
    }
    // io.to(data.Code).emit("receive_bid",{bid:"-30",Code : data.Code,Name:"patel"});
    // io.sockets.in(data.Code).emit("receive_bid",{bid:"-1",Code : data.Code,Name:"patel"});
    // socket.to(data.Code).emit("receive_bid",{bid:"-2",Code : data.Code,Name:"patel"});
  })


  socket.on('send_bid',async(data)=>{
    console.log("Data on Bid eve ",data);
    if(!data.user){
      socket.emit("auth_error",{msg:"user not exists!"});
    }
    else{
    let resp = await AuctionModel.find({Room:data.Code}).sort({_id:-1}).limit(1);
    let res;
    if(resp){
      res = resp[0];
    }
    // console.log(res.Bid,data.bid);
    if((res && res.Bid < data.bid) || (!res)){
      console.log(resp.Bid,data.bid);
        bid = data.bid;
        // socket.broadcast.to(data.Code).emit("receive_bid",data);
         io.sockets.in(data.Code).emit('receive_bid', {Bid:data.bid,User : data.user,Room : data.Code});
         io.sockets.in(data.Code).emit("curr_bid",{Bid:data.bid,User : data.user,Room : data.Code});
         await AuctionModel.create({Bid:data.bid,User : data.user,Room : data.Code});
        // io.to(data.Code).emit('receive_bid',data);
        // socket.to(data.Code).emit("receive_bid",data);
    }
    else{
      console.log("Error",data.bid,resp.Bid);
      socket.emit("error_bid",res);
    }
  }
  })
})


module.exports = AuctionServer;



// To limit sockets per tab

// Define a maximum limit of sockets per tab
// const MAX_SOCKETS_PER_TAB = 5;

// // Keep track of the number of sockets per tab
// const socketsPerTab = {};

// // When a socket connects, check if the tab has reached the limit
// io.on('connection', (socket) => {
//   const { id: socketId } = socket;
//   const { tabId } = socket.handshake.query;

//   // Increment the number of sockets for the tab
//   socketsPerTab[tabId] = socketsPerTab[tabId] || 0;
//   socketsPerTab[tabId]++;

//   // If the limit has been reached, disconnect the socket
//   if (socketsPerTab[tabId] > MAX_SOCKETS_PER_TAB) {
//     socket.disconnect();
//     return;
//   }

//   // Otherwise, add the socket to the room
//   socket.join('roomName');
  
//   // When the socket disconnects, decrement the number of sockets for the tab
//   socket.on('disconnect', () => {
//     socketsPerTab[tabId]--;
//   });
// });
