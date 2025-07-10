const mongoose = require('mongoose');

const ClearedListSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    tResidue: {
        type: String,
        required: true,
    },
    tGrain: {
        type: String,
        required: true,
    },
    sDate: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('ClearedList', ClearedListSchema);