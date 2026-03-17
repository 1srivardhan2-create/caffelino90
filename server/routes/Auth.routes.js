const express = require("express");
const router = express.Router();
const { googleLogin, checkRole } = require("../controllers/auth.controller");

// POST /api/auth/google-login
router.post("/google-login", googleLogin);

// POST /api/auth/google (alias)
router.post("/google", googleLogin);

// POST /api/auth/check-role — Check which collections an email exists in
router.post("/check-role", checkRole);

module.exports = router;
