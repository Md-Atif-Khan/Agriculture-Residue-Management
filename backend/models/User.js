const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    mobileNo: {
        type: String,
        required: function() {
            // Only require mobile number if not a Google-authenticated user
            return !this.googleId;
        },
        unique: true,
        sparse: true,  // Allow multiple null/undefined values
        minlength: 6,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 100,
    },
    password: {
        type: String,
        required: function() {
            // Only require password if not a Google-authenticated user
            return !this.googleId;
        },
        minlength: 6,
        maxlength: 100,
    },
    avatar: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpires: {
        type: Date
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);