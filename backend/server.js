const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from frontend

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/marketplaceDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
