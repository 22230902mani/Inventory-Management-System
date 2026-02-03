const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyResetCode, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.get('/profile', require('../middleware/authMiddleware').protect, require('../controllers/authController').getProfile);
router.get('/loggedInUser', require('../controllers/authController').loggedInUser);

module.exports = router;
