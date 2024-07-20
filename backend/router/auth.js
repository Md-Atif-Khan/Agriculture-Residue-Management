const express = require('express');
const router = express.Router();
const UserInfo = require('../models/User');
const auth = require('../middleware/auth');
///////////////////////////////
router.get('/',auth,async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
    } catch(err){
        console.error(err.message)
        res.status(500).send('Server Error');

    }
});

router.post('/',async (req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    // console.log(req.body);

    const {email,password}= req.body;
    try{
        let user = await User.findOne({email:email});
        if(!user){
            res.status(400).json({errors:[{msg:'Invalid User'}]});
        }
        const isMatch = password === user.password;

        // const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({errors:[{msg:'Invalid Credential'}]});
        }
        const payload ={
            user:{
                id : user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            {expiresIn:360000},
            (err,token)=>{
                if(err){
                    throw err;
                }
                res.json({token});
            }
            )
    }catch(err){console.error(err.message);
        res.status(500).send('Server Error');
    }    
});
/////////////////////////////////


// router.post('/signup', async (req, res) => {
//     try{
//          console.log(req.body);
//         const EmailExist = await User.findOne({ email: req.body.email });
//         if (EmailExist) return res.status(200).send("Email exist");
//         else{
//             const newUser = new User({
//                 name: req.body.name,
//                 mobileno:req.body.mobileno,
//                 email: req.body.email,
//                 password: req.body.password,
//                // userType: req.body.type
//             });
//             // console.log("Printed");
//             newUser.save().then((result) => {
//                 // console.log("Saved");
//                 res.redirect('/');
//             }).catch(err => res.status(300).send(err));
//         }
//     } catch(err){
//         console.error(err.message)
//         res.status(500).send('Server Error');

//     }
// });


router.post('/signup', async (req,res)=>{
       
    const user = new UserInfo({
        name: req.body.name,
        mobileno: req.body.mobileno,
        email: req.body.email,
        password: req.body.password,
    })
    const data = await user.save();
    if(data){
        res.status(200).send({data: data, message: `Hello ${user.name} You Registered!!`});
    }
    else{
        res.status(202).send({message: `Error Occured!`});
    }
}
);

router.post('/login', async (req,res)=>{

    console.log(req.body);
    const user = await UserInfo.findOne({email:req.body.email});
    if(user){
        if(user.password === req.body.password){
            res.send({user : user, message : `Hello, ${user.name} You logged in successfully!`});
        }else{
            res.send({message : "Invalid Password"});
        }
    }else{
        res.send({message : "User Not Found!"});
    }

});

module.exports = router;