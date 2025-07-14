// server/routes/authRoutes.js
const express = require('express');
const router = express.Router(); // Express router instance
const { registerUser, authUser } = require('../controllers/authController'); // Auth controllers import kiye

// Route for user registration (POST /api/auth/register)
router.post('/register', registerUser);

// Route for user login (POST /api/auth/login)
router.post('/login', authUser);

module.exports = router; // Router ko export kar rahe hain