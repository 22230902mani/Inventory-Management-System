const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getMyOrders, updateOrderStatus, verifyDelivery, verifyPayment, getPayouts, processPayout } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, authorize('admin', 'manager'), getOrders);
router.get('/my-orders', protect, getMyOrders);
router.route('/payouts').get(protect, getPayouts);
router.route('/:id/payout').put(protect, authorize('admin', 'manager'), processPayout);
router.route('/:id/verify-delivery').post(protect, authorize('admin', 'manager'), verifyDelivery);
router.route('/:id/status').put(protect, authorize('admin', 'manager'), updateOrderStatus);
router.route('/verify-payment').post(protect, authorize('admin', 'manager'), verifyPayment);

module.exports = router;
