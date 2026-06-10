const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User/User");
const Cafe = require("../models/Cafe/Cafe_login");
const { getFirebaseAdmin } = require("../config/firebase");

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

const mobileLogin = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile Number is required" });
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

        if (!user) {
            return res.status(404).json({ message: "No account found with this mobile number. Please register first." });
        }

        // Generate a simple 6-digit OTP (e.g. 123456 or a random code)
        const generatedOtp = "123456"; // standard demo OTP
        user.otp = generatedOtp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
        await user.save();

        console.log(`📱 OTP generated for ${cleanPhone}: ${generatedOtp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: generatedOtp, // return OTP so the app can auto-fill or print it for developers!
        });
    } catch (error) {
        console.error("Mobile Login Error:", error.message);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

const mobileVerifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({ message: "Mobile Number and OTP are required" });
        }

        const cleanPhone = mobileNumber.trim();
        const dummyEmail = `${cleanPhone}@caffelino.app`;

        // Check user
        let user = await User.findOne({ 
            $or: [
                { mobileNumber: cleanPhone },
                { email: dummyEmail }
            ] 
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP (accept 123456 or saved OTP)
        if (otp !== "123456" && user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP code. Please try again." });
        }

        // Clear OTP on successful verify
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

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
            message: "OTP verification successful",
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
                profileCompleted: user.profileCompleted || false,
            }
        });
    } catch (error) {
        console.error("Mobile Verify OTP Error:", error.message);
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

// POST /api/auth/firebase-phone — Verify Firebase ID token after phone OTP
const firebasePhoneLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Firebase ID token is required" });
        }

        const admin = getFirebaseAdmin();
        if (!admin) {
            return res.status(503).json({
                message: "Firebase is not configured on the server. Set FIREBASE_SERVICE_ACCOUNT_JSON.",
            });
        }

        const decoded = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decoded.uid;
        const phoneRaw = decoded.phone_number;
        if (!phoneRaw) {
            return res.status(400).json({ message: "Phone number not found in Firebase token" });
        }

        const mobileDigits = normalizeMobileDigits(phoneRaw);
        const localTen = mobileDigits.length >= 10 ? mobileDigits.slice(-10) : mobileDigits;
        const dummyEmail = `${mobileDigits}@caffelino.app`;

        let user = await User.findOne({
            $or: [
                { firebaseUid },
                { mobileNumber: mobileDigits },
                { mobileNumber: localTen },
                { email: dummyEmail },
            ],
        });

        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            const casualAvatars = ["male-casual-1", "male-casual-2", "female-casual-1", "female-casual-2"];
            const randomAvatar = casualAvatars[Math.floor(Math.random() * casualAvatars.length)];
            user = await User.create({
                name: "Coffee Lover",
                email: dummyEmail,
                mobileNumber: mobileDigits,
                firebaseUid,
                authProvider: "firebase",
                isVerified: true,
                profileCompleted: false,
                avatarId: randomAvatar,
                gender: randomAvatar.startsWith("male") ? "male" : "female",
            });
        } else {
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
            }
            if (!user.mobileNumber) user.mobileNumber = mobileDigits;
            user.isVerified = true;
            user.authProvider = user.authProvider || "firebase";
            await user.save();
            isNewUser = !user.profileCompleted;
        }

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
            isNewUser: !user.profileCompleted,
            user: buildAuthUserResponse(user),
        });
    } catch (error) {
        console.error("Firebase Phone Login Error:", error.message);
        res.status(401).json({ message: "Invalid or expired Firebase token", error: error.message });
    }
};

module.exports = {
    googleLogin,
    checkRole,
    mobileSignup,
    mobileLogin,
    mobileVerifyOtp,
    firebasePhoneLogin,
};
