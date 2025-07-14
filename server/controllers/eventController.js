// server/controllers/eventController.js - Get Events Controller Debugging

const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        console.log('Backend: Attempting to fetch published events...'); // Debug log
        const events = await Event.find({ isPublished: true }).sort({ date: 1 });
        console.log(`Backend: Fetched ${events.length} published events.`); // Debug log
        res.json(events);
    } catch (error) {
        console.error(`Backend ERROR in getEvents controller: ${error.message}`); // More specific error log
        console.error('Backend: Full error object for getEvents:', error); // Log full error object for more details
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (Baaki ke functions jaise getEventById, createEvent, updateEvent, deleteEvent same rahenge) ...

// Make sure module.exports is at the end:

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(`Error in getEventById: ${error.message}`);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer only)
const createEvent = async (req, res) => {
    const { name, description, date, location, category, imageUrl, price, availableTickets, ticketTypes, isPublished } = req.body;

    try {
        const event = new Event({
            name,
            description,
            date,
            location,
            category,
            imageUrl,
            price,
            availableTickets,
            ticketTypes,
            isPublished: isPublished !== undefined ? isPublished : false,
            organizer: req.user._id, // Organizer ki ID jo authenticated user hai
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error(`Error in createEvent: ${error.message}`);
        // Mongoose validation errors ko handle karo
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private (Organizer or Admin only)
const updateEvent = async (req, res) => {
    // Destructure all fields from request body, including ticketTypes
    const { name, description, date, location, category, imageUrl, price, availableTickets, ticketTypes, isPublished } = req.body;

    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Authorization check: Only event organizer OR admin can update
        // req.user._id comes from JWT token (logged-in user's ID)
        // event.organizer is the creator of the event
        // req.user.role is the role of the logged-in user
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        // Update event fields with new data (direct assignment)
        event.name = name;
        event.description = description;
        event.date = date;
        event.location = location;
        event.category = category;
        event.imageUrl = imageUrl;
        event.price = price;
        event.availableTickets = availableTickets;
        event.isPublished = isPublished;
        event.ticketTypes = ticketTypes || []; // Ensure it's an array, even if empty

        const updatedEvent = await event.save(); // Save the updated event
        res.json(updatedEvent); // Send back the updated event
    } catch (error) {
        console.error(`Error in updateEvent: ${error.message}`);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found with provided ID' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer or Admin only)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Authorization check: Only event organizer OR admin can delete
        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await Event.deleteOne({ _id: req.params.id });
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error(`Error in deleteEvent: ${error.message}`);
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found with provided ID' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};