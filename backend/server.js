require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:');
        console.error('Error Code:', err.code);
        console.error('Hostname:', err.hostname);
        console.error('Full Error:', err);
        process.exit(1); // Exit process on failure so nodemon restarts
    });

// Routes Placeholders
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Admin only
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes')); // Stats
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 6700;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
