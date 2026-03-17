const Cafe = require("../models/Cafe/Cafe_login");

// ─── Approve a Cafe ──────────────────────────────────────────────
const approveCafe = async (req, res) => {
    const cafe = await Cafe.findByIdAndUpdate(
        req.params.id,
        { status: true },
        { new: true }
    );

    if (!cafe) {
        return res.status(404).json({ message: "Cafe not found" });
    }

    res.json({ message: "Cafe approved successfully" });
};

// ─── Get All Pending (Unapproved) Cafes ──────────────────────────
const getPendingCafes = async (req, res) => {
    const cafes = await Cafe.find({ status: false });
    res.json(cafes);
};

module.exports = { approveCafe, getPendingCafes };
