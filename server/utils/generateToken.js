// server/utils/generateToken.js
const jwt = require('jsonwebtoken'); // JWT library

// Function to generate a JSON Web Token (JWT)
const generateToken = (id) => {
    // jwt.sign() method token create karta hai
    // id: Payload (user ki ID) jo token mein store hogi
    // process.env.JWT_SECRET: Token ko sign karne ke liye secret key
    // expiresIn: Token kitne samay tak valid rahega (e.g., '30d' for 30 days)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken; // generateToken function ko export kar rahe hain