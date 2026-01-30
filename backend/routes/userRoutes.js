const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getActivityLogs, verifyUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'manager'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/verify', protect, authorize('admin'), verifyUser);
router.get('/logs', protect, authorize('admin'), getActivityLogs);

module.exports = router;
