const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const products = await Product.find({ ...keyword, status: 'active' });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ $expr: { $lt: ["$quantity", "$lowStockThreshold"] } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addProduct = async (req, res) => {
    const { name, sku, category, quantity, price, supplier, lowStockThreshold, description, barcode, companyName, images } = req.body;

    try {
        const productExists = await Product.findOne({ sku });
        if (productExists) return res.status(400).json({ message: 'Product with this SKU already exists' });

        const status = req.user && req.user.role === 'sales' ? 'pending' : 'active';

        const product = await Product.create({
            name, sku, category, quantity, price, supplier, lowStockThreshold, description, barcode,
            companyName, images,
            status,
            addedBy: req.user ? req.user._id : null
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        const updatedProduct = await product.save();

        // Check for Low Stock Signal
        if (updatedProduct.quantity < updatedProduct.lowStockThreshold) {
            try {
                const highLevelOps = await User.find({ role: { $in: ['admin', 'manager'] } });
                const notifications = highLevelOps.map(op => ({
                    to: op._id,
                    from: req.user?.id || op._id, // System alert if no requester
                    title: 'Asset Depletion Alert',
                    message: `Strategic asset "${updatedProduct.name}" has fallen below critical thresholds (${updatedProduct.quantity}/${updatedProduct.lowStockThreshold}). Restock required.`
                }));
                await Notification.insertMany(notifications);
            } catch (err) { console.error('Low Stock Signal Failure:', err); }
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductByBarcode = async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode, status: 'active' });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- New Sales Team / Approval Logic ---

exports.getPendingProducts = async (req, res) => {
    try {
        // Populate addedBy to show who proposed it
        const products = await Product.find({ status: 'pending' }).populate('addedBy', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.status = 'active';
        await product.save();

        res.json({ message: 'Product approved and active', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.status = 'rejected';
        await product.save();

        res.json({ message: 'Product rejected', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyProposals = async (req, res) => {
    try {
        const products = await Product.find({ addedBy: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
