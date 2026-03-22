const Cafe = require("../models/Cafe/Cafe_login");

const cafeExists = async (req, res, next) => {
    try {
        // Step 1: Check if auth middleware ran (req.cafe should exist)
        if (!req.cafe) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const { id, userId } = req.cafe;

        if (!id && !userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        // Step 2: Find the cafe in the database
        let cafe = null;
        if (id) {
            cafe = await Cafe.findById(id);
        }
        
        if (!cafe && userId) {
            cafe = await Cafe.findOne({ ownerId: userId });
        }

        // Step 3: Check if cafe exists
        if (!cafe) {
            return res.status(404).json({
                message: "Cafe not found",
            });
        }

        // Step 4: Proceed
        // Normalize req.cafe.id for downstream controllers
        req.cafe.id = cafe._id.toString();
        next();
    } catch (error) {
        console.error("Cafe Exists Middleware Error:", error);
        res.status(500).json({ message: "Server error in cafe check" });
    }
};

module.exports = cafeExists;
