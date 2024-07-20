const CompanyModel = require('../Models/Company');


module.exports.Register = async function Register(req,res){
    console.log(req.body);
    // res.send("hello");
    const {Email,Password,Name} = req.body;
    try{
        const resp = await CompanyModel.create({Email,Password,Name});
        if(resp){
            res.json({success:true, message :"Successfully Signedup",Name});
        }
        else{
            res.status(400).json({success : false , message : "Some error occured"});
        }
    }
    catch(err){
        res.status(500).json({success : false, message : "Internal Server Error"});
    }
}

module.exports.Login = async function Login(req,res){
    console.log(req.body);
    const {Email,Password} = req.body;
    try{
        const resp = await CompanyModel.findOne({Email:Email});
        console.log(resp);
        if(resp && resp.Password == Password){
            let Name = resp.Name;
            res.json({success:true, message :"Successfully Logged In",Name});
        }
        else{
            res.status(400).json({success : false , message : "Some error occured"});
        }
    }
    catch(err){
        res.status(500).json({success : false, message : "Internal Server Error"});
    }
}