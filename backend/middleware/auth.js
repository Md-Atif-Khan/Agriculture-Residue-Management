const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');
const{check,validationResult} =require('express-validator/check');

module.exports = function(req,res,next) {
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg : 'enter token' });
    }
    try{
        const decoded = jwt.verify(token,config.get('jwtToken'));
        req.user=decoded.user;
        next();
    } catch(err){
        return res.status(401).json({msg:'Wrong Token'});
    }
}

