const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        min: 6,
        max: 30,
    },
    mobileno:{
        type:String,
        required:true,
        min: 6,
      max: 15,
    },
    acre:{
        type:String,
        required:true,
        min: 1,
      max: 10,
    },
    ptype:{
        type:String,
        required:true,
        min: 2,
      max: 50,
    },
    date1:{
        type:Date,
        required:true, 
    },
    du1:{
        type:Date,
        required:true
    },
    du2:{
        type:Date,
        required:true
    },
    type:{
        type:String,
        min: 2,
      max: 50,
        
        required:true
    },
    mtype:{
        type:String,
        min: 2,
      max: 50,
        required:true
    }
});

const service = mongoose.model('ServiceInfo',ServiceSchema);
module.exports = service;