const jwt = require("jsonwebtoken");
require("dotenv").config();

const authCafe = (req, res, next) => {
    // Step 1: Extract token from cookies OR Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    // Step 2: Check if token exists
    if (!token) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    try {
        // Step 3: Verify and decode the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        );

        // Step 4: Attach decoded data to request
        req.cafe = decoded; // Contains { id: cafeId, iat: ..., exp: ... }
        next();
    } catch (err) {
        // Step 5: Token is invalid or expired
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authCafe;
