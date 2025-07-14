// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Password hashing ke liye library

// User Schema define kar rahe hain
const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Har user ka email unique hona chahiye
        },
        password: {
            type: String,
            required: true,
        },
        role: { // User ka role: attendee, organizer, ya admin
            type: String,
            enum: ['attendee', 'organizer', 'admin'], // Allowed roles
            default: 'attendee', // Agar specify na karein toh default attendee
        },
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt fields
    }
);

// Password ko database mein save hone se pehle hash karein
// 'pre' hook: 'save' event se pehle chalega
UserSchema.pre('save', async function (next) {
    // Agar password modify nahi hua hai, toh hashing skip karo
    if (!this.isModified('password')) {
        next(); // Next middleware/operation par jao
    }
    // Salt generate karo (random string to add complexity to hash)
    const salt = await bcrypt.genSalt(10);
    // Password ko hash karo using generated salt
    this.password = await bcrypt.hash(this.password, salt);
});

// User ke entered password ko stored hashed password se compare karne ka method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); // User model ko export kar rahe hain