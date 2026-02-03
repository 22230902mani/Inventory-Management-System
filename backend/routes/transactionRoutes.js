const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    getAnalytics,
    exportTransactions,
    deleteTransaction
} = require('../controllers/transactionController');

// All routes require authentication
router.use(protect);

// GET /api/transactions - Get all transactions (role-based filtering)
router.get('/', getTransactions);

// GET /api/transactions/analytics - Get analytics (Admin only)
router.get('/analytics', authorize('admin'), getAnalytics);

// GET /api/transactions/export - Export transactions (Admin only)
router.get('/export', authorize('admin'), exportTransactions);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransaction);

// POST /api/transactions - Create transaction (Admin, Manager)
router.post('/', authorize('admin', 'manager'), createTransaction);

// PUT /api/transactions/:id - Update transaction (Admin, Manager)
router.put('/:id', authorize('admin', 'manager'), updateTransaction);

// DELETE /api/transactions/:id - Delete transaction (Admin only)
router.delete('/:id', authorize('admin'), deleteTransaction);

module.exports = router;
