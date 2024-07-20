const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});

module.exports =mongoose.model('CompanyInfo',CompanySchema);