const admin = require("firebase-admin");

let initialized = false;

/** Web API key from .env (optional; native apps use google-services.json) */
function getFirebaseApiKey() {
    return process.env.FIREBASE_API_KEY || "";
}

function initFirebaseAdmin() {
    if (initialized) return admin;
    if (admin.apps.length > 0) {
        initialized = true;
        return admin;
    }

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!json) {
        console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON not set — Firebase phone auth API disabled.");
        return null;
    }

    try {
        const serviceAccount = JSON.parse(json);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        initialized = true;
        console.log("✅ Firebase Admin initialized");
        return admin;
    } catch (error) {
        console.error("Firebase Admin init failed:", error.message);
        return null;
    }
}

function getFirebaseAdmin() {
    return initFirebaseAdmin();
}

module.exports = { getFirebaseAdmin, initFirebaseAdmin, getFirebaseApiKey };
