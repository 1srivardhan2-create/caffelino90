const express = require("express");
const router = express.Router();
const {
    googleLogin,
    checkRole,
    mobileSignup,
    mobileLogin,
    mobileVerifyOtp,
    firebasePhoneLogin,
} = require("../controllers/auth.controller");

// POST /api/auth/google-login
router.post("/google-login", googleLogin);

// POST /api/auth/google (alias)
router.post("/google", googleLogin);

// POST /api/auth/check-role — Check which collections an email exists in
router.post("/check-role", checkRole);

// Mobile Native Auth Endpoints
router.post("/mobile-signup", mobileSignup);
router.post("/mobile-login", mobileLogin);
router.post("/mobile-verify-otp", mobileVerifyOtp);

// Firebase Phone Auth (mobile app — verify ID token, issue JWT)
router.post("/firebase-phone", firebasePhoneLogin);

module.exports = router;
