// server/config/db.js
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Mongoose ka connect method use kar rahe hain
        // process.env.MONGO_URI .env file se aayega
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        
        process.exit(1); // Agar connection fail ho toh process exit kar do
    }
};

module.exports = connectDB; // connectDB function ko export kar rahe hain