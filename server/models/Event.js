// server/models/Event.js
const mongoose = require('mongoose');

// Event Schema define kar rahe hain
const EventSchema = mongoose.Schema(
    {
        name: { // Event ka naam
            type: String,
            required: true,
            trim: true, // Leading/trailing spaces remove karega
        },
        description: { // Event ka pura description
            type: String,
            required: true,
        },
        date: { // Event ki date aur time
            type: Date,
            required: true,
        },
        location: { // Event ka physical ya virtual location
            type: String,
            required: true,
            trim: true,
        },
        category: { // Event ki category (e.g., Tech, Music)
            type: String,
            required: true,
            enum: ['Technology', 'Music', 'Sports', 'Art', 'Business', 'Education', 'Other'], // Allowed categories
        },
        imageUrl: { // Event poster ya banner image ka URL
            type: String,
            default: 'https://via.placeholder.com/400x200/4B0082/FFFFFF?text=Elevate+Events', // Default placeholder image
        },
        price: { // Single ticket ka base price (agar ticketTypes specify nahi kiye gaye)
            type: Number,
            required: true,
            default: 0, // Free event ke liye 0
        },
        availableTickets: { // Total available tickets (agar ticketTypes nahi hain)
            type: Number,
            required: true,
            default: 0,
        },
        organizer: { // Jis user ne event create kiya hai uski ID
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // 'User' model se link kiya hai
            required: true,
        },
        isPublished: { // Event live hai ya draft mode mein
            type: Boolean,
            default: false,
        },
        // Multiple ticket types (e.g., Standard, VIP)
        ticketTypes: [
            {
                name: { type: String, required: true }, // Ticket type ka naam (e.g., "General Admission")
                price: { type: Number, required: true }, // Is type ka price
                quantity: { type: Number, required: true }, // Is type ki kitni tickets hain
            },
        ],
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Event', EventSchema); // Event model ko export kar rahe hain