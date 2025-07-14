const mongoose = require('mongoose');

const AuctionRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 30,
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 8,
    },
    startBid: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('AuctionRoom', AuctionRoomSchema);