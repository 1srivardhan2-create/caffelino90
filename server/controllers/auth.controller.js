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
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                picture: user.picture,
                googleId: user.googleId,
                role: "user",
                profileCompleted: user.profileCompleted || false,
                age: user.age,
                gender: user.gender,
                city: user.city,
                mobileNumber: user.mobileNumber
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

const mobileSignup = async (req, res) => {
    try {
        const { fullName, mobileNumber } = req.body;

        if (!fullName || !mobileNumber) {
            return res.status(400).json({ message: "Full Name and Mobile Number are required" });
        }

        const cleanPhone = mobileNumber.trim();
        const cleanName = fullName.trim();
        const dummyEmail = `${cleanPhone}@caffelino.app`;

        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { mobileNumber: cleanPhone },
                { email: dummyEmail }
            ] 
        });

        if (user) {
            return res.status(400).json({ message: "An account with this mobile number already exists." });
        }

        // Auto-assign random casual avatar ID
        const casualAvatars = ['male-casual-1', 'male-casual-2', 'female-casual-1', 'female-casual-2'];
        const randomAvatar = casualAvatars[Math.floor(Math.random() * casualAvatars.length)];
        const defaultGender = randomAvatar.startsWith('male') ? 'male' : 'female';

        // Create new user account
        user = await User.create({
            name: cleanName,
            firstName: cleanName.split(' ')[0] || cleanName,
            lastName: cleanName.split(' ').slice(1).join(' ') || "",
            email: dummyEmail,
            mobileNumber: cleanPhone,
            authProvider: "email", // matching schema enum
            isVerified: true,
            profileCompleted: true,
            avatarId: randomAvatar,
            gender: defaultGender,
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: "user",
                profileCompleted: true,
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                avatarId: user.avatarId,
                gender: user.gender,
                role: "user",
                profileCompleted: true,
            }
        });
    } catch (error) {
        console.error("Mobile Signup Error:", error.message);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile Number is required" });
        }

        const cleanPhone = mobileNumber.trim();
        const digitsOnly = String(cleanPhone).replace(/\D/g, "");
        // The mobile number sent to AuthKey should ideally be without the country code, 
        // as country_code is passed separately in the URL.
        // E.g., if digitsOnly is 12 digits starting with 91, extract the last 10.
        const mobileForAuthKey = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

        const authKeyUrl = `https://console.authkey.io/restapi/request.php?authkey=${process.env.AUTHKEY_API_KEY}&mobile=${mobileForAuthKey}&country_code=91&sid=${process.env.AUTHKEY_SID}`;

        const response = await fetch(authKeyUrl);
        const data = await response.json();

        if (data.Message === "Submitted Successfully" || data.LogId) {
            console.log(`📱 AuthKey OTP sent for ${mobileForAuthKey}, LogId: ${data.LogId}`);
            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                logId: data.LogId
            });
        } else {
            console.error("AuthKey Send Error:", data);
            res.status(400).json({ message: "Failed to send OTP", error: data });
        }
    } catch (error) {
        console.error("Send OTP Error:", error.message);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp, logId } = req.body;

        if (!mobileNumber || !otp || !logId) {
            return res.status(400).json({ message: "Mobile Number, OTP, and LogId are required" });
        }

        const authKeyUrl = `https://console.authkey.io/api/2fa_verify.php?authkey=${process.env.AUTHKEY_API_KEY}&channel=SMS&otp=${otp}&logid=${logId}`;
        
        const response = await fetch(authKeyUrl);
        const data = await response.json();

        if (data.Message !== "Successful" && data.Status !== "Success" && data.Message !== "Valid OTP") {
            // Adjust based on exact AuthKey valid response structure. 
            // "Successful" or "Valid OTP" are common success messages.
            if (!data.Message?.toLowerCase().includes("success") && !data.Message?.toLowerCase().includes("valid")) {
                console.error("AuthKey Verify Error:", data);
                return res.status(400).json({ message: "Invalid OTP code. Please try again." });
            }
        }

        const cleanPhone = mobileNumber.trim();
        const dummyEmail = `${cleanPhone}@caffelino.app`;

        // Check if user exists
        let user = await User.findOne({ 
            $or: [
                { mobileNumber: cleanPhone },
                { email: dummyEmail }
            ] 
        });

        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            const casualAvatars = ["male-casual-1", "male-casual-2", "female-casual-1", "female-casual-2"];
            const randomAvatar = casualAvatars[Math.floor(Math.random() * casualAvatars.length)];
            user = await User.create({
                name: "Coffee Lover",
                email: dummyEmail,
                mobileNumber: cleanPhone,
                authProvider: "authkey",
                isVerified: true,
                profileCompleted: false,
                avatarId: randomAvatar,
                gender: randomAvatar.startsWith("male") ? "male" : "female",
            });
        } else {
            user.isVerified = true;
            await user.save();
            isNewUser = !user.profileCompleted;
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: "user",
                profileCompleted: user.profileCompleted || false,
            },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: isNewUser ? "Phone verified. Complete your profile." : "Login successful",
            token,
            isNewUser,
            user: buildAuthUserResponse(user)
        });
    } catch (error) {
        console.error("Verify OTP Error:", error.message);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

// ─── Normalize phone to digits (e.g. 919876543210 or 9876543210 → store 919876543210) ───
function normalizeMobileDigits(phone) {
    if (!phone) return "";
    let digits = String(phone).replace(/\D/g, "");
    if (digits.length === 10) digits = "91" + digits;
    if (digits.startsWith("91") && digits.length === 12) return digits;
    return digits;
}

function buildAuthUserResponse(user) {
    return {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        avatarId: user.avatarId,
        username: user.username,
        gender: user.gender,
        city: user.city,
        role: user.role || "user",
        profileCompleted: user.profileCompleted || false,
    };
}

module.exports = {
    googleLogin,
    checkRole,
    mobileSignup,
    sendOtp,
    verifyOtp,
};
