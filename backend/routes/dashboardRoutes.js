const express = require('express');
const router = express.Router();
const { getDashboardStats, getUserNotifications, sendInternalMessage, getAllUsersList, createTestNotification } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin', 'manager'), getDashboardStats);
router.get('/notifications', protect, getUserNotifications);
router.post('/send-message', protect, authorize('admin', 'manager'), sendInternalMessage);
router.get('/users-list', protect, authorize('admin', 'manager'), getAllUsersList);
router.post('/test-notification', protect, createTestNotification);

module.exports = router;
