const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, getSalesMessages, getManagerMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/', protect, getMessages);
router.get('/sales', protect, getSalesMessages);
router.get('/managers', protect, getManagerMessages);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
