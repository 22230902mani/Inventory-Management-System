const Product = require('../models/Product');
const Order = require('../models/Order');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chatWithAI = async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Masked log for debugging (only shows first 4 and last 4 chars)
    if (apiKey) {
        const masked = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "****";
        console.log(`[Neural Link] Initializing with key: ${masked}`);
    }

    try {
        // Fetch Context Data
        const products = await Product.find({});
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);

        const contextStr = `
        Current System Context:
        - User Name: ${req.user.name}
        - Role: ${req.user.role}
        - Inventory: ${products.map(p => `${p.name} (Qty: ${p.quantity}, Price: ₹${p.price}, Threshold: ${p.lowStockThreshold})`).join(', ')}
        - Recent Orders: ${orders.map(o => `Order #${o._id.toString().slice(-6)}: ${o.status} (Total: ₹${o.totalAmount})`).join('; ')}
        - Total Business Value: ₹${products.reduce((acc, p) => acc + (p.price * p.quantity), 0)}
        `;

        if (!apiKey || apiKey.startsWith('YOUR_') || apiKey.length < 10) {
            return res.json({ response: "Neural Link Error: No valid API key detected. Please add a functional **GEMINI_API_KEY** from Google AI Studio to your backend `.env` file." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an Intelligent Inventory Assistant for this specific application. 
        Structure your responses to be as helpful and natural as ChatGPT.
        ${contextStr}
        
        User Query: "${query}"
        
        Instructions:
        1. If the user asks about general topics, answer them like ChatGPT would.
        2. If the user asks about the business, stock, or orders, use the provided context.
        3. Be professional, concise, and use emojis.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ response: responseText });

    } catch (error) {
        console.error('Final AI Error:', error.message);
        let errorMsg = `Neural Error: ${error.message}`;

        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
            errorMsg = "Neural Bandwidth Exceeded! 😫 Quota limits reached. Please wait or upgrade your API tier.";
        }

        res.status(500).json({ response: errorMsg });
    }
};
