const mongoose = require("mongoose");
//const config = require('config');
//const db = config.get('mongoURI');  
require('dotenv').config();
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/stubbleburning';

function connectDB() {
  mongoose.set('strictQuery', false);
  mongoose.connect(db).then((resp) => {
    console.log("Successfully Connected to the DB");
  })
    .catch((err) => {
      console.log("Error Occured at DB connection ", err);
    });
  const connection = mongoose.connection;
}

module.exports = connectDB;