const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    mobileNo: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100,
    }
});

module.exports = mongoose.model('Admin', AdminSchema); 