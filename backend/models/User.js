const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  mobileno: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 2,
    max: 30,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 50,
  }
});

module.exports = mongoose.model('UserInfo', UserSchema);