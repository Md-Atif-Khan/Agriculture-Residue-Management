const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

// module.exports = function (req, res, next) {
//     const token = req.header('x-auth-token');
//     if (!token) {
//         return res.status(401).json({ msg: 'enter token' });
//     }
//     try {
//         const decoded = jwt.verify(token, config.get('jwtToken'));
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         return res.status(401).json({ msg: 'Wrong Token' });
//     }
// }


module.exports = function(req, res, next) {
    console.log('Auth middleware called');
    
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        console.log('Verifying token...');
        // Use JWT secret from environment or fallback to hardcoded value
        const jwtSecret = process.env.JWT_TOKEN || 'mytokenyoyoyo';
        
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);
        
        // Check if the decoded token has the expected structure
        if (!decoded.user || !decoded.user.id) {
            console.error('Token is valid but missing user data');
            return res.status(401).json({ msg: 'Invalid token format' });
        }
        
        // Set user data in request
        req.user = decoded.user;
        console.log('Token verified successfully for user:', req.user.id);
        
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        
        // Provide more detailed error message
        let errorMsg = 'Token is not valid';
        if (err.name === 'TokenExpiredError') {
            errorMsg = 'Session has expired. Please log in again.';
        } else if (err.name === 'JsonWebTokenError') {
            errorMsg = `JWT error: ${err.message}`;
        }
        
        res.status(401).json({ 
            msg: errorMsg,
            error: err.message
        });
    }
}

