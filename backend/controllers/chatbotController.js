const Product = require('../models/Product');
const Order = require('../models/Order');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chatWithAI = async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

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

        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            // Simplified fallback if no key is provided
            return res.json({ response: "I am ready to work like ChatGPT! To unlock my full intelligence, please add your **GEMINI_API_KEY** to the backend `.env` file. \n\nI can still answer basic inventory questions for now." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-flash-latest which is confirmed working in Dec 2025.
        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        } catch (e) {
            console.log("Gemini Flash Latest failed to initialize, trying pro");
            model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        }

        const prompt = `
        You are an Intelligent Inventory Assistant for this specific application. 
        Structure your responses to be as helpful and natural as ChatGPT.
        ${contextStr}
        
        User Query: "${query}"
        
        Instructions:
        1. If the user asks about general topics (like geography, coding, or jokes), answer them like ChatGPT would.
        2. If the user asks about the business, stock, or orders, use the provided context accurately.
        3. Be professional, concise, and use emojis where appropriate.
        4. If the user wants to perform actions you can't do (like "delete my account"), guide them to the right dashboard or ask a manager.
        `;

        let responseText;
        try {
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
        } catch (genError) {
            console.error('Gemini Flash Latest generation failed, trying pro-latest:', genError.message);
            try {
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
                const fallbackResult = await fallbackModel.generateContent(prompt);
                responseText = fallbackResult.response.text();
            } catch (fallbackError) {
                console.error('All Gemini models failed:', fallbackError.message);
                throw fallbackError; // Re-throw to be caught by the outer catch block
            }
        }

        res.json({ response: responseText });

    } catch (error) {
        console.error('AI Error:', error.message);
        let errorMsg = `AI Error: ${error.message}`;

        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
            errorMsg = "My AI quota has been exceeded! 😫 Please check your **GEMINI_API_KEY** billing details or wait a moment before trying again. The free tier might be exhausted.";
        }

        res.status(500).json({ response: errorMsg });
    }
};
