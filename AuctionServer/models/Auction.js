const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
    bid: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        default: 'Anonymous'
    },
    room: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Auction', AuctionSchema); 