const mongoose = require("mongoose");
const config = require('config');
const db = config.get('mongoURI');

// const connectDB = async ()=>{
//     try{
//         await mongoose.connect(db,{
//             useNewUrlParser: true
//         });
//         console.log('Connected with DB')
//     }catch(err){
//         console.error(err.message);

//         process.exit(1);
//     }
// }


function connectDB(){
    mongoose.set('strictQuery', false);
    mongoose.connect(db).then((resp)=>{
        console.log("Successfully Connected to the DB");
      })
      .catch((err)=>{
        console.log("Error Occured at DB connection ",err);
      });
    const connection = mongoose.connection;

    // connection.once('open', ()=>{
    //     console.log("DB Connected");
    // });
}
    

module.exports = connectDB;