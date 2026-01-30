const User = require('../models/User');
const Notification = require('../models/Notification');
const axios = require('axios'); // Added for Web3Forms submission
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, email, password, role, adminCode } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Admin registration protection
        let finalRole = role || 'user';
        if (adminCode === '22230902') {
            finalRole = 'admin';
        } else if (role === 'admin') {
            return res.status(403).json({ message: 'Invalid Admin Secret Code' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: finalRole,
            isVerified: true
        });

        // Notify Admins of new enrollment
        try {
            const admins = await User.find({ role: 'admin' });
            const notifications = admins.map(admin => ({
                to: admin._id,
                from: user._id,
                title: 'New Operative Recruited',
                message: `Identity ${name} (${role || 'user'}) has enrolled in the CoreIMS protocol. Clearances pending.`
            }));
            await Notification.insertMany(notifications);
        } catch (notifierErr) {
            console.error('Enrollment Signal Failed:', notifierErr);
        }

        res.status(201).json({ message: 'User registered successfully. Please login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.isVerified) return res.status(200).json({ message: 'User already verified' });

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            const token = generateToken(user._id);
            res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password, adminCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Admin login protection
        if (user.role === 'admin' && adminCode !== '22230902') {
            return res.status(403).json({ message: 'Admin Verification Code Required' });
        }

        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
