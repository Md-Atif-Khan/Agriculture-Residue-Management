const nodemailer = require('nodemailer');
const { createTestAccount: nodeCreateTestAccount, createTransport, getTestMessageUrl } = require('nodemailer');

// Create primary Gmail transporter
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER || 'managementstubble@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'rqgk aajr rwkz eilp'
    },
    debug: true // Enable debug output
});

// Create a fallback transporter using ethereal.email (for testing)
let testTransporter = null;

// Function to create test account if gmail fails
const createLocalTestAccount = async () => {
    try {
        const testAccount = await nodeCreateTestAccount();
        console.log('Created test account:', testAccount.user);
        
        testTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        
        return {
            success: true,
            user: testAccount.user,
            pass: testAccount.pass
        };
    } catch (err) {
        console.error('Error creating test account:', err);
        return { success: false, error: err.message };
    }
};

// Verify Gmail transporter configuration on startup
gmailTransporter.verify(function(error, success) {
    if (error) {
        console.error('Gmail configuration error:', error);
        console.log('Will attempt to use ethereal.email as fallback');
        createLocalTestAccount();
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendWinnerNotification = async (winnerEmail, winnerName, bidAmount, roomName) => {
    try {
        console.log(`Sending winner notification to ${winnerEmail}`);
        
        const mailOptions = {
            from: `"Stubble Management" <${process.env.EMAIL_USER || 'managementstubble@gmail.com'}>`,
            to: winnerEmail,
            subject: 'Congratulations! You Won the Auction',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h1 style="color: #036A48; text-align: center;">Congratulations ${winnerName}!</h1>
                    <p style="font-size: 16px; line-height: 1.5;">You have won the auction for "${roomName}" with your bid of ₹${bidAmount}.</p>
                    <p style="font-size: 16px; line-height: 1.5;">Our team will contact you shortly to arrange the delivery of the stubble.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <h3 style="color: #036A48;">Auction Details:</h3>
                        <p><strong>Room Name:</strong> ${roomName}</p>
                        <p><strong>Your Winning Bid:</strong> ₹${bidAmount}</p>
                    </div>
                    <p style="font-size: 14px; color: #666;">Thank you for participating in our auction system.</p>
                </div>
            `
        };

        const info = await gmailTransporter.sendMail(mailOptions);
        console.log('Winner notification sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error('Error sending winner notification:', err);
        throw err;
    }
};

const sendAdminAuctionEndNotification = async (adminEmail, winnerName, winnerEmail, bidAmount, roomName) => {
    try {
        console.log(`Sending admin notification about auction end to ${adminEmail}`);
        
        const mailOptions = {
            from: `"Stubble Management" <${process.env.EMAIL_USER || 'managementstubble@gmail.com'}>`,
            to: adminEmail,
            subject: 'Auction Completed - Action Required',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h1 style="color: #036A48; text-align: center;">Auction Completed</h1>
                    <p style="font-size: 16px; line-height: 1.5;">The auction for "${roomName}" has been completed.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <h3 style="color: #036A48;">Winner Details:</h3>
                        <p><strong>Winner Name:</strong> ${winnerName}</p>
                        <p><strong>Winner Email:</strong> ${winnerEmail}</p>
                        <p><strong>Winning Bid:</strong> ₹${bidAmount}</p>
                        <p><strong>Auction Room:</strong> ${roomName}</p>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5;">Please arrange for the stubble to be delivered to the winner.</p>
                </div>
            `
        };

        const info = await gmailTransporter.sendMail(mailOptions);
        console.log('Admin notification sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error('Error sending admin notification:', err);
        throw err;
    }
};

module.exports = {
    sendWinnerNotification,
    sendAdminAuctionEndNotification
}; 