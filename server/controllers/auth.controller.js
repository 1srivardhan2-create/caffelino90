const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User/User");
const Cafe = require("../models/Cafe/Cafe_login");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/google-login
const googleLogin = async (req, res) => {
    try {
        const { credential, loginRole } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // ─── Role-Aware Login Logic ──────────────────────────────────
        // loginRole can be: "user" (from user app), "cafe" (from partner app), or undefined

        if (loginRole === "cafe") {
            // ── CAFE OWNER LOGIN ─────────────────────────────────────
            // Find or create user with role "user" (they get cafe role via caves collection)
            let user = await User.findOne({ email });

            if (user) {
                if (!user.googleId) {
                    user.googleId = googleId;
                    user.authProvider = "google";
                    user.isVerified = true;
                }
                if (name) user.name = name;
                if (picture) user.picture = picture;
                await user.save();
            } else {
                user = await User.create({
                    email,
                    googleId,
                    name,
                    picture,
                    authProvider: "google",
                    isVerified: true,
                    role: "user",
                });
            }

            // --- Auto-link Cafe ownerId ---
            // If the user logs in as cafe, ensure the cafe's ownerId matches the user._id
            const existingCafe = await Cafe.findOne({ email_address_manager: email });
            if (existingCafe && existingCafe.ownerId !== user._id.toString()) {
                existingCafe.ownerId = user._id.toString();
                await existingCafe.save();
                console.log("🔗 Auto-linked existing cafe to new Google User _id");
            }

            // Generate JWT with role "cafe" for partner flow
            const token = jwt.sign(
                {
                    id: existingCafe ? existingCafe._id : null,
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    googleId: user.googleId,
                    role: "cafe",
                    profileCompleted: user.profileCompleted || false,
                },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    googleId: user.googleId,
                    role: "cafe",
                    profileCompleted: user.profileCompleted || false,
                },
            });
        }

        // ── USER LOGIN (default) ─────────────────────────────────
        let user = await User.findOne({ email });

        if (user) {
            // Existing user — update Google info if needed
            console.log("✅ Existing user found in MongoDB:", email);
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = "google";
                user.isVerified = true;
            }
            if (name) user.name = name;
            if (picture) user.picture = picture;
            // Ensure role is "user" for user login flow
            if (loginRole === "user" && user.role === "owner") {
                user.role = "user";
            }
            await user.save();
        } else {
            // New user — create account with role "user"
            console.log("🆕 Creating new user in MongoDB:", { email, name, googleId });
            user = await User.create({
                email,
                googleId,
                name,
                picture,
                authProvider: "google",
                isVerified: true,
                role: "user",
            });
            console.log("✅ User created successfully:", user._id);
        }

        // Generate JWT with role "user"
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                googleId: user.googleId,
                role: "user",
                profileCompleted: user.profileCompleted || false,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                googleId: user.googleId,
                role: "user",
                profileCompleted: user.profileCompleted || false,
            },
        });
    } catch (error) {
        console.error("Google Login Error:", error.message);
        res.status(500).json({ message: "Authentication failed", error: error.message });
    }
};

// POST /api/auth/check-role
// Check which collections an email exists in (for role selection UI)
const checkRole = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const userExists = await User.findOne({ email });
        const cafeExists = await Cafe.findOne({ email_address_manager: email });

        res.status(200).json({
            success: true,
            hasUserAccount: !!userExists,
            hasCafeAccount: !!cafeExists,
            cafeStatus: cafeExists ? cafeExists.status : null,
        });
    } catch (error) {
        console.error("Check Role Error:", error.message);
        res.status(500).json({ message: "Failed to check role", error: error.message });
    }
};

module.exports = { googleLogin, checkRole };
