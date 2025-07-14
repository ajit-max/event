// server/routes/eventRoutes.js
const express = require('express');
const router = express.Router(); // Express router instance
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController'); // Event controllers import kiye
const { protect } = require('../middlewares/authMiddleware'); // Authentication middleware import kiya

// Public Routes (koi bhi access kar sakta hai)
router.get('/', getEvents); // Sabhi events fetch karega
router.get('/:id', getEventById); // Specific event ID se fetch karega

// Private Routes (only logged-in users can access)
// 'protect' middleware route ko access karne se pehle authentication check karega
router.post('/', protect, createEvent); // Naya event create karega (requires authentication)
router.put('/:id', protect, updateEvent); // Event update karega (requires authentication and owner check)
router.delete('/:id', protect, deleteEvent); // Event delete karega (requires authentication and owner check)

module.exports = router; // Router ko export kar rahe hain