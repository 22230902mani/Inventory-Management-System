const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, forgotPassword, verifyResetCode, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.get('/profile', require('../middleware/authMiddleware').protect, require('../controllers/authController').getProfile);

module.exports = router;
