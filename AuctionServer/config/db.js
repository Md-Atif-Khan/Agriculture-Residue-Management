const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/stubbleburning';

const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://usmaniii:usmaniii123@cluster0.ky9wk.mongodb.net/', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });
        await mongoose.connect(db).then(() => {
            console.log('MongoDB Connected from Auction Server');
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB; 