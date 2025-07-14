const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const config = require('config');
const User = require('../models/User');
const AuctionModel = require('../models/Auction');
const ClearedList = require('../models/ClearedList');
const Admin = require('../models/Admin')
const Company = require('../models/Company');
const RoomModel = require('../models/AuctionRoom');
const service = require('../models/Service');
const { encryption } = require('../middleware/hasing')
const { check, validationResult } = require('express-validator/check');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Generate verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Define the schema for room participants if it doesn't exist elsewhere
const RoomParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    roomCode: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model if it doesn't already exist
const RoomParticipation = mongoose.models.RoomParticipation || mongoose.model('RoomParticipation', RoomParticipationSchema);


router.get('/api/auth/me', auth, async (req, res) => {
    try {
        // Get the user type from the token
        const userType = req.user.type;

        if (userType === 'Farmer') {
            const user = await User.findById(req.user.id).select('-password');
            if (user) {
                return res.json({
                    user,
                    userType: 'Farmer'
                });
            }
        } else if (userType === 'Company') {
            const company = await Company.findById(req.user.id).select('-password');
            if (company) {
                return res.json({
                    user: company,
                    userType: 'Company'
                });
            }
        } else if (userType === 'Admin') {
            const admin = await Admin.findById(req.user.id).select('-password');
            if (admin) {
                return res.json({
                    user: admin,
                    userType: 'Admin'
                });
            }
        }

        return res.status(404).json({ msg: 'User not found' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/api/auth/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('userType', 'User type is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    try {
        let user;
        if (userType === 'Farmer') {
            user = await User.findOne({ email });
        } else if (userType === 'Company') {
            user = await Company.findOne({ email });
        } else if (userType === 'Admin') {
            user = await Admin.findOne({ email });
        } else {
            return res.status(400).json({ msg: 'Invalid user type' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'No account found with this email' });
        }

        // Check password length
        if (!password || password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }
        else if (!password || password.length > 100) {
            return res.status(400).json({ msg: 'Password must be less than 100 characters' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        const payload = {
            user: {
                id: user.id,
                type: userType
            }
        };

        // Use either environment variable or config for JWT token
        const jwtSecret = process.env.JWT_TOKEN || 'mytokenyoyoyo';

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ msg: 'Error creating authentication token' });
                }

                console.log(`Login successful for: ${email}`);
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        type: userType
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            msg: 'Server Error',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a user (Farmer or Company only)
 * @access  Public
 */
router.post('/api/auth/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('mobileNo', 'Mobile number is required').not().isEmpty(),
    check('userType', 'User type is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, mobileNo, userType } = req.body;

    // Prevent registration as Admin
    if (userType === 'Admin') {
        return res.status(403).json({ msg: 'Admin registration not allowed' });
    }

    try {
        // Check for duplicate email
        const emailExists =
            await User.findOne({ email }) ||
            await Company.findOne({ email }) ||
            await Admin.findOne({ email });

        if (emailExists) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Check for duplicate mobile number
        const mobileExists =
            await User.findOne({ mobileNo }) ||
            await Company.findOne({ mobileNo }) ||
            await Admin.findOne({ mobileNo });

        if (mobileExists) {
            return res.status(400).json({ msg: 'Mobile number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24);

        let newUser;

        if (userType === 'Farmer') {
            newUser = new User({
                name,
                mobileNo,
                email,
                password: hashedPassword,
                emailVerificationToken: verificationToken,
                emailVerificationExpires: verificationExpires
            });
        } else if (userType === 'Company') {
            newUser = new Company({
                name,
                mobileNo,
                email,
                password: hashedPassword,
                emailVerificationToken: verificationToken,
                emailVerificationExpires: verificationExpires
            });
        } else {
            return res.status(400).json({ msg: 'Invalid user type' });
        }

        // Save and catch validation errors
        await newUser.save();

        return res.status(201).json({
            msg: 'Registration successful',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                type: userType
            }
        });
    } catch (err) {
        // Handle duplicate key error (shouldn't happen due to above checks, but just in case)
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({ msg: 'Email already exists' });
            }
            if (err.keyPattern && err.keyPattern.mobileNo) {
                return res.status(400).json({ msg: 'Mobile number already exists' });
            }
            return res.status(400).json({ msg: 'Duplicate field error' });
        }
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => {
                if (e.kind === 'minlength') {
                    return `${e.path} must be at least ${e.properties.minlength} characters`;
                }
                if (e.kind === 'maxlength') {
                    return `${e.path} must be at most ${e.properties.maxlength} characters`;
                }
                if (e.kind === 'required') {
                    return `${e.path} is required`;
                }
                return e.message;
            });
            return res.status(400).json({ msg: messages.join(', ') });
        }
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard data (admin)
 * @access  Private (Admin only)
 */
router.get('/api/dashboard', auth, async (req, res) => {
    try {
        // Get current date and time
        const currentDate = new Date();

        // Get active rooms (end date is in the future)
        const rooms = await RoomModel.find({ endDate: { $gt: currentDate } });
        const services = await service.find();

        res.json({
            rooms,
            services
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const User = await User.findById(req.user.id).select('-password');
        const Company = await Company.findById(req.user.id).select('-password');
        if (req.session.email) {
            res.status(200).send({ loggedIn: true });
        }
        else {
            res.status(200).send({ loggedIn: false });
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ errors: [{ msg: 'Invalid User' }] });
        }
        const isMatch = password === user.password;

        // const isMatch =await bcrypt.compare(password,user.password);
        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
        }
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    throw err;
                }
                res.json({ token });
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/SignUpFarmer', encryption, async (req, res) => {
    try {
        // console.log(req.body);
        const EmailExist = await User.findOne({ email: req.body.email });
        const MobileExist = await User.findOne({ mobileNo: req.body.mobileNo });
        if (MobileExist) return res.status(200).send("Mobile no. exist");
        if (EmailExist) return res.status(200).send("Email exist");
        else {
            const newUser = await User.create({
                name: req.body.name,
                mobileNo: req.body.mobileNo,
                email: req.body.email,
                password: req.body.password,
                // userType: req.body.type
            });
            // console.log(newUser);
            if (newUser) {
                res.json({ success: true, msg: "successfully created" })
            }
            else {
                res.status(401).json({ success: false, msg: "Error occured, Please SignUp again" })
            }
            // newUser.save();
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');

    }
});

router.post('/SignUpCompany', encryption, async (req, res) => {
    try {
        // console.log(req.body);
        const MobileExist = await Company.findOne({ mobileNo: req.body.mobileNo });
        if (MobileExist) return res.status(200).send("Mobile no. exist");
        const EmailExist = await Company.findOne({ email: req.body.email });
        if (EmailExist) return res.status(200).send("Email exist");
        else {
            const newCom = await Company.create({
                name: req.body.name,
                mobileNo: req.body.mobileNo,
                email: req.body.email,
                password: req.body.password,
                // userType: req.body.type
            });
            // console.log("Printed", newCom);
            if (newCom) {
                res.json({ success: true, msg: "successfully created company." })
            }
            else {
                res.status(401).json({ success: false, msg: "Error occured, Please SignUp again" })
            }

            // newCom.save().then((result) => {
            //     console.log("Saved");
            //     res.redirect('/');
            // }).catch(err => res.status(300).send(err));
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');

    }
});

router.post('/SignUpAdmin', encryption, async (req, res) => {
    try {
        console.log(req.body);
        const MobileExist = await Admin.findOne({ mobileNo: req.body.mobileNo });
        if (MobileExist) return res.status(200).send("Mobile no. exist");
        const EmailExist = await Admin.findOne({ email: req.body.email });
        if (EmailExist) return res.status(200).send("Email exist");
        else {
            const newAd = await Admin.create({
                name: req.body.name,
                mobileNo: req.body.mobileNo,
                email: req.body.email,
                password: req.body.password,
                // userType: req.body.type
            });
            // console.log("Printed", newAd);
            if (newAd) {
                res.json({ success: true, msg: "successfully created Admin." })
            }
            else {
                res.status(401).json({ success: false, msg: "Admin is not created." })
            }

            //     newAd.save().then((result) => {
            //         console.log("Saved");
            //         res.redirect('/');
            //     }).catch(err => res.status(300).send(err));
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});
// router.login('/LoginFarmer',async(req,res)=>{
//     try{
//         console.log(req.body);
//         const EmailExist = await User.findOne({ email: req.body.email });
//         if(EmailExist){
//             if()
//         }
//     }

// })

router.post("/LoginFarmer", async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {

            // var token = jwt.sign({ email: user.email, password:upass  }, `${process.env.TOCKEN_PRIVATE_KEY}`);

            res.status(200).send({
                data: user,
                //   cookie: token,
                type: "Farmer",
                success: true,
                message: `Hello    ${user.name},   You   Logged   in   successfully!`,
                name: user.name

            });

        } else
            res.status(201).send({ success: false, message: "Error! : *** Invalid Password ***" });
    } else {
        res.status(202).send({ success: false, message: "Error! : *** userNotfound ***" });
    }
});

router.post("/LoginCompany", async (req, res) => {
    const { email, password } = req.body;
    const company = await Company.findOne({ email: email });
    console.log(company);
    if (company) {
        if (await bcrypt.compare(password, company.password)) {

            // var token = jwt.sign({ email: company.email, password:company.password  }, `${process.env.TOCKEN_PRIVATE_KEY}`);

            res.status(200).send({
                data: company,
                //   cookie: token,
                type: "Company",
                message: `Hello ${company.name}, You Logged in successfully!`,
                success: true,
                name: Company.name,

            });

        } else
            res.status(201).send({ success: false, message: "Error! : *** Invalid Password ***" });
    } else {
        res.status(202).send({ success: false, message: "Error! : *** userNotfound ***" });
    }
});

router.post("/LoginAdmin", async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
        if (await bcrypt.compare(password, admin.password)) {

            // var token = jwt.sign({ email: Admin.email, password:adpass  }, `${process.env.TOCKEN_PRIVATE_KEY}`);

            res.status(200).send({
                data: admin,
                //   cookie: token,
                type: "Admin",
                name: admin.name,
                success: true,
                message: `Hello ${admin.name}, You Logged in successfully!`,

            });

        } else
            res.status(201).send({ success: false, message: "Error! : *** Invalid Password ***" });
    } else {
        res.status(202).send({ success: false, message: "Error! : *** userNotfound ***" });
    }
});

router.post("/Service", async (req, res) => {
    const { email, password } = req.body;
    try {
        const EmailExist = await service.findOne({ email: req.body.email });
        if (EmailExist) return res.status(200).send("Already Requested!!!");
        else {
            const newSer = await service.create({
                email: req.body.email,
                mobileNo: req.body.mobileNo,
                acre: req.body.acre,
                pType: req.body.ptype,
                date1: req.body.date1,
                du1: req.body.du1,
                du2: req.body.du2,
                type: req.body.type,
                mType: JSON.stringify(req.body.mtype),
                // userType: req.body.type
            });
            if (newSer) {
                res.json({ success: true, msg: "successfully requested for harvesting." })
            }
            else {
                res.status(401).json({ success: false, msg: "Request is not accepted." })
            }
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');

    }
});

router.post('/CreateRoom', async (req, res) => {
    try {
        const NameExist = await RoomModel.findOne({ Name: req.body.Name });
        if (NameExist) return res.status(200).send("Already Requested!!!");
        else {
            const createRoom = await RoomModel.create({
                name: req.body.Name,
                description: req.body.description,
                code: req.body.Code,
                startBid: req.body.StartBid,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            });
            if (createRoom) {
                await AuctionModel.create({
                    bid: req.body.StartBid,
                    user: "Admin",
                    userName: req.body.userName,
                    room: req.body.Code
                })
                res.json({ success: true, msg: "successfully Created Room for the Auction.." })
            }
            else {
                res.status(401).json({ success: false, msg: "Room is not Created." })
            }
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
});

router.post('/ClearReqForm', async (req, res) => {
    try {
        const Service = await service.findOne({ email: req.body.email });
        const ReqExist = req.body.email;
        if (!ReqExist) return res.status(200).send("No such request exists!!!");
        else {
            const ClearList = await ClearedList.create({
                email: req.body.email,
                tResidue: req.body.tResidue,
                tGrain: req.body.tgrain,
                sDate: req.body.sdate
                // userType: req.body.type
            });
            await Service.remove({
                email: req.body.email,
                // userType: req.body.type
            });
            if (ClearList) {
                res.json({ success: true, msg: "Request is successfully removed from Pending Requests && added to ClearedList.." })
            }
            else {
                res.status(401).json({ success: false, msg: "Request is still in pendingList." })
            }
        }

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');

    }
});

router.post("/AdminHome", async (req, res) => {
    try {
        const room = await RoomModel.find({});
        const service1 = await service.find({});

        if (room && service1) {
            res.status(200).send({ room, service1 });
        }
        else {
            res.status(202).send({ message: "Not Found!" });
        }
    } catch (e) {
        console.log("Error: ", e);
    }
})

/**
 * @route   GET /api/rooms/all
 * @desc    Get all active rooms
 * @access  Private
 */
router.get('/api/rooms/all', auth, async (req, res) => {
    try {
        const currentDate = new Date();
        const rooms = await RoomModel.find({ endDate: { $gt: currentDate } });
        res.json({ rooms });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route   GET /api/rooms/joined
 * @desc    Get rooms that the user has joined
 * @access  Private
 */
router.get('/api/rooms/joined', auth, async (req, res) => {
    try {
        // Get current date
        const currentDate = new Date();

        // Get rooms the user has joined through the participation records
        const participations = await RoomParticipation.find({
            userId: req.user.id,
            userType: req.user.type
        });

        if (!participations || participations.length === 0) {
            return res.json({ rooms: [] });
        }

        // Extract room codes that the user has joined
        const joinedRoomCodes = participations.map(p => p.roomCode);

        // Find all active rooms that match these codes
        const rooms = await RoomModel.find({
            code: { $in: joinedRoomCodes },
            endDate: { $gt: currentDate }
        });

        res.json({ rooms });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route   POST /api/rooms/join
 * @desc    Join an auction room
 * @access  Private
 */
router.post('/api/rooms/join', auth, async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ msg: 'Room code is required' });
        }

        // Check if room exists
        const room = await RoomModel.findOne({ code });

        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        // Check if room is still active
        const currentDate = new Date();
        if (room.endDate < currentDate) {
            return res.status(400).json({ msg: 'This auction has ended' });
        }

        // Check if user has already joined this room
        const existingParticipation = await RoomParticipation.findOne({
            userId: req.user.id,
            userType: req.user.type,
            roomCode: code
        });

        let participantAdded = false;

        // If not already joined, record participation
        if (!existingParticipation) {
            await RoomParticipation.create({
                userId: req.user.id,
                userType: req.user.type,
                roomCode: code
            });
            participantAdded = true;
        }

        // Notify auction server about participant (if connected)
        try {
            const io = require('socket.io-client');
            const socket = io('http://localhost:8001');
            socket.emit('room_joined', { code, userId: req.user.id });
            socket.disconnect();
        } catch (socketErr) {
            console.error('Failed to notify auction server:', socketErr);
            // Non-critical error, continue anyway
        }

        return res.json({
            success: true,
            msg: 'Successfully joined the auction room',
            room,
            participantAdded
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route   GET /api/rooms/:code/bids/highest
 * @desc    Get the highest bid for a room
 * @access  Private
 */
router.get('/api/rooms/:code/bids/highest', auth, async (req, res) => {
    try {
        const { code } = req.params;

        // Find the highest bid for this room
        const highestBid = await AuctionModel.findOne({ room: code })
            .sort({ bid: -1 })  // Sort by bid amount in descending order
            .limit(1);          // Get only the highest bid

        if (!highestBid) {
            return res.status(404).json({ msg: 'No bids found for this room' });
        }

        // Return bid info
        res.json({
            amount: highestBid.bid,
            bidder: highestBid.user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;