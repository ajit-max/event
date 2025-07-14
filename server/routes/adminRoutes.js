// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router(); // Express router instance
const User = require('../models/User'); // User model import kiya
const Event = require('../models/Event'); // Event model import kiya

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
    try {
        // Sabhi users ko fetch karo, password field exclude kar ke.
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(`Error fetching users for admin: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all events (for admin, including unpublished)
// @route   GET /api/admin/events
// @access  Private/Admin
router.get('/events', async (req, res) => {
    try {
        // Sabhi events ko fetch karo (isPublished ka filter nahi hai admin ke liye).
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        console.error(`Error fetching events for admin: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin panel ke liye aur routes bhi add kar sakte ho:
// router.delete('/users/:id', async (req, res) => { /* logic to delete user */ });
// router.put('/users/:id/role', async (req, res) => { /* logic to change user role */ });
// router.delete('/events/:id', async (req, res) => { /* logic to delete event */ });
// router.put('/events/:id/publish', async (req, res) => { /* logic to toggle event publish status */ });


module.exports = router; // router ko export karo.