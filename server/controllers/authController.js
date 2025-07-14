// server/controllers/authController.js
const User = require('../models/User'); // User model ko import kiya
const generateToken = require('../utils/generateToken'); // JWT token banane ka utility function

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // Request body se user details extract kiye
    const { name, email, password, role } = req.body;

    try {
        // Check karein ki user is email se already registerd hai ya nahi
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Naya user create karein
        const user = await User.create({
            name,
            email,
            password, // Password automatically hash hoga UserSchema ke pre-save hook se
            role, // Role agar provide kiya gaya hai toh, else default 'attendee'
        });

        // Agar user successfully create ho gaya
        if (user) {
            res.status(201).json({ // 201 Created status code
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // User ID ke liye JWT token generate kiya
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' }); // Invalid data
        }
    } catch (error) {
        console.error(`Error in registerUser: ${error.message}`);
        res.status(500).json({ message: 'Server Error' }); // General server error
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    // Request body se email aur password extract kiye
    const { email, password } = req.body;

    try {
        // Email se user ko find karein database mein
        const user = await User.findOne({ email });

        // Agar user mil gaya aur password match ho gaya
        if (user && (await user.matchPassword(password))) {
            res.json({ // User details aur token return karein
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // JWT token generate kiya
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // Unauthorized
        }
    } catch (error) {
        console.error(`Error in authUser: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, authUser }; // Functions ko export kar rahe hain