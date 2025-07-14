const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const connectDB = require('./db');

// Admin credentials (customize these)
const adminData = {
    name: 'admin',
    email: 'admin@gmail.com',
    mobileNo: '1234567890',
    password: 'adminadmin'  // Will be hashed before storing
};

const seedAdmin = async () => {
    try {
        // Connect to database (this will be shared with other parts of the app)
        await connectDB();
        
        // Check if admin already exists
        const adminExists = await Admin.findOne({ email: 'admin@gmail.com' });
        
        if (!adminExists) {
            // Create new admin
            const admin = new Admin({
                name: adminData.name,
                email: adminData.email,
                mobileNo: adminData.mobileNo,
                password: adminData.password
            });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);

            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
        throw err;
    }
};

// Run the seed function if this script is executed directly
if (require.main === module) {
    seedAdmin().then(() => {
        // Only disconnect if run as a standalone script
        mongoose.disconnect();
    });
}

module.exports = seedAdmin; 