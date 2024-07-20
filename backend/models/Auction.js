const mongoose = require('mongoose');

const Auction = mongoose.Schema({
    Bid :{
        type : Number,
        required:true,
    },
    User : {
        type : String,
        required : true,
         
    },
    Room :{
        type : String,
        required : true,
    }
});

const AuctionModel = mongoose.model("auction",Auction);

module.exports = AuctionModel;