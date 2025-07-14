// server/server.js
const { protect } = require('./middlewares/authMiddleware'); // Already imported, just verify
const { admin } = require('./middlewares/adminMiddleware'); // Naya import
const adminRoutes = require('./routes/adminRoutes'); // Naya import
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Frontend se requests allow karne ke liye
const connectDB = require('./config/db'); // Database connection function
const authRoutes = require('./routes/authRoutes'); // Authentication related routes
const eventRoutes = require('./routes/eventRoutes'); // Event related routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express(); // Express app initialize kiya

// Middleware
app.use(express.json()); // JSON request body ko parse karne ke liye middleware
app.use(cors()); // CORS (Cross-Origin Resource Sharing) allow karne ke liye. Development mein sab origins allow.

// Routes
// /api/auth ke saare requests authRoutes handle karega
app.use('/api/auth', authRoutes);
// /api/events ke saare requests eventRoutes handle karega
app.use('/api/events', eventRoutes);

// Admin routes, protected by authMiddleware (protect) and adminMiddleware (admin)
app.use('/api/admin', protect, admin, adminRoutes); // Naya route

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('Elevate Events API is running!');
});

// Server kis port par listen karega (default 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});