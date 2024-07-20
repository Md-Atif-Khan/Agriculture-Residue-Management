const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    Name : {
        type : String,
        required : true,
        unique:true,
        min:2,
        max:30,
    },
    description : {
        type : String,
        required : true,
        min:2,
        max:100,
    },
    Code :{
        type : String,
        required : true,
        unique : true,
        min:4,
        max:8,
    },
    StartBid :{
        type : Number,
        required : true,
        // unique : true,
        // min:4,
        // max:8,
    },
    startDate :{
        type:Date,
        required:true,
    },
    endDate :{
        type:Date,
        required:true,
    },
});

const RoomModel = mongoose.model('Room',RoomSchema);

module.exports = RoomModel;