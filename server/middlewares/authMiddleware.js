// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken'); // JWT library
const User = require('../models/User'); // User model ko import kiya

// Middleware function to protect routes (authentication check)
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    // Example: Authorization: Bearer <token_string>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token extract karein 'Bearer' ke baad wala part
            token = req.headers.authorization.split(' ')[1];

            // Token ko verify karein JWT_SECRET use karke
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verified user ki ID se user ko find karein (password field exclude kar ke)
            // Aur user object ko req (request) object mein attach karein
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Agle middleware function ya route handler par jao
        } catch (error) {
            console.error(`Auth Middleware Error: ${error.message}`);
            res.status(401).json({ message: 'Not authorized, token failed' }); // Token invalid ya expired
        }
    }
    // Agar token nahi mila header mein
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' }); // Unauthorized
    }
};

module.exports = { protect }; // protect middleware ko export kar rahe hain