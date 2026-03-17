const mongoose = require("mongoose");

let isConnected = false;

/**
 * Connect to MongoDB with auto-retry.
 * Does NOT crash the server — keeps retrying in the background.
 */
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        console.error("❌ MONGO_URI is not defined in .env — cannot connect to database.");
        return;
    }

    // Log a masked URI for debugging
    const maskedURI = MONGO_URI.replace(/\/\/.*@/, "//<credentials>@");
    console.log("🔌 Connecting to MongoDB...", maskedURI);

    mongoose.set("strictQuery", false);

    // Connection event handlers
    mongoose.connection.on("connected", () => {
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    });

    mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.log("⚠️  MongoDB disconnected. Mongoose will auto-reconnect...");
    });

    mongoose.connection.on("error", (err) => {
        isConnected = false;
        console.error("❌ MongoDB connection error:", err.message);
    });

    // Attempt connection with retry logic
    const attemptConnection = async (retryCount = 0) => {
        try {
            await mongoose.connect(MONGO_URI);

            // ─── Post-connection index & cleanup tasks ───────────────
            const db = mongoose.connection.db;

            try {
                await db.collection("meetups").createIndex({ meetupCode: 1 }, { unique: true });
                console.log("✅ meetupCode index ensured on meetups collection");
            } catch (e) { /* Index may already exist */ }

            try {
                await db.collection("caves").dropIndex("email_address_manager_1");
                console.log("✅ Dropped unique index on email_address_manager");
            } catch (e) { /* Index doesn't exist or already dropped */ }

            try {
                await db.collection("caves").deleteMany({ ownerId: "123" });
                await db.collection("caves").deleteMany({ ownerId: "124" });
            } catch (e) { /* Cleanup is best-effort */ }

        } catch (err) {
            console.error(`❌ MongoDB Connection Attempt ${retryCount + 1} Failed:`, err.message);
            console.error("   Make sure your IP is whitelisted in MongoDB Atlas (Network Access).");

            // Retry after a delay (max 5 retries, then stop flooding logs)
            if (retryCount < 5) {
                const delay = Math.min(5000 * (retryCount + 1), 30000); // 5s, 10s, 15s, 20s, 25s
                console.log(`🔄 Retrying in ${delay / 1000}s...`);
                setTimeout(() => attemptConnection(retryCount + 1), delay);
            } else {
                console.error("❌ All MongoDB connection attempts failed. Server is running but DB is unavailable.");
                console.error("   Fix your MongoDB Atlas IP whitelist and restart the server.");
            }
        }
    };

    await attemptConnection();
};

/**
 * Middleware to check if DB is connected before processing requests.
 */
const requireDB = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database is temporarily unavailable. Please try again in a moment.",
        });
    }
    next();
};

module.exports = { connectDB, requireDB, isConnected };
