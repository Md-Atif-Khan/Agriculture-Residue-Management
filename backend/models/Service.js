const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 30,
    },
    mobileNo: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15,
    },
    acre: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10,
    },
    pType: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    date1: {
        type: Date,
        required: true,
    },
    du1: {
        type: Date,
        required: true
    },
    du2: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    mType: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    }
});

module.exports = mongoose.model('Service', ServiceSchema);