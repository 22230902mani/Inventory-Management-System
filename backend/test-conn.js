const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('Testing connection to MongoDB...');

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connection Successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Message:', err.message);
        process.exit(1);
    });
