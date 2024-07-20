const mongoose = require('mongoose');

const ClearedList = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
     tResidue:{
        type : String,
        required:true,
    },
    tgrain : {
        type : String,
        required : true,
    },
    sdate :{
        type : Date,
        required : true,
    }
});

const model = mongoose.model("ClearedList",ClearedList);

module.exports = model;