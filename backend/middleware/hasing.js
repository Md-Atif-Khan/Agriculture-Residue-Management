const bcrypt = require('bcrypt');

module.exports.encryption = async function encryption(req,res,next){
    let salt = await bcrypt.genSalt();
    let hasedString = await bcrypt.hash(req.body.password,salt);
    req.body.password = hasedString;
    next();
}