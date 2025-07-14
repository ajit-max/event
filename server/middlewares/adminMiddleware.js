// server/middlewares/adminMiddleware.js
// Yeh middleware check karega ki authenticated user ka role 'admin' hai ya nahi.

const admin = (req, res, next) => {
    // req.user object authMiddleware.js se aata hai, jismein logged-in user ki details hoti hain.
    if (req.user && req.user.role === 'admin') {
        next(); // Agar user admin hai, toh request ko next middleware/route handler par pass karo.
    } else {
        // Agar user admin nahi hai, toh 403 Forbidden status code ke saath error response bhejo.
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin }; // admin middleware ko export karo.