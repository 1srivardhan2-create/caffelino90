const Cafe = require("../models/Cafe/Cafe_login");

const cafeApproved = async (req, res, next) => {
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
        // It could be identified by the Cafe _id (id) or the Owner User _id (userId)
        let cafe = null;
        if (id) {
            cafe = await Cafe.findById(id);
        }
        
        if (!cafe && userId) {
            cafe = await Cafe.findOne({ ownerId: userId });
        }


        // Step 3: Check if cafe exists AND is approved
        if (!cafe || cafe.status !== true) {
            return res.status(403).json({
                message: "Cafe not approved by admin yet",
            });
        }

        // Step 4: Cafe is approved — proceed
        // Normalize req.cafe.id for downstream controllers
        req.cafe.id = cafe._id.toString();
        next();
    } catch (error) {
        console.error("Cafe Approved Middleware Error:", error);
        res.status(500).json({ message: "Server error in approval check" });
    }
};

module.exports = cafeApproved;
