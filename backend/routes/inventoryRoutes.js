const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getLowStockProducts, getPendingProducts, approveProduct, getMyProposals } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'manager', 'user', 'sales'), getProducts);
router.get('/low-stock', protect, authorize('admin', 'manager'), getLowStockProducts);
router.get('/pending', protect, authorize('admin', 'manager'), getPendingProducts);
router.get('/my-proposals', protect, authorize('sales'), getMyProposals);
router.get('/barcode/:barcode', protect, authorize('admin', 'manager'), require('../controllers/inventoryController').getProductByBarcode);

router.post('/', protect, authorize('admin', 'manager', 'sales'), addProduct);
router.put('/:id/approve', protect, authorize('admin', 'manager'), approveProduct);
router.put('/:id/reject', protect, authorize('admin', 'manager'), require('../controllers/inventoryController').rejectProduct);
router.put('/:id', protect, authorize('admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
