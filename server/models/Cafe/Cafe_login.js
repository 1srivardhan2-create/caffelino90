const mongoose = require("mongoose");

const daySchema = {
    open: { type: String },
    close: { type: String },
    closed: { type: Boolean, default: false },
};

const Cafe_log = new mongoose.Schema(
    {
        // ─── Owner Link (Google User) ────────────────────────────────
        ownerId: {
            type: String,
        },

        // ─── Business Information ────────────────────────────────────
        Name: {
            type: String,
            required: [true, "Cafe name is required"],
            trim: true,
        },
        Cafe_Address: {
            type: String,
        },
        cafe_location: {
            type: String,
        },
        latitude: {
            type: Number,
            default: 0,
        },
        longitude: {
            type: Number,
            default: 0,
        },
        establishmentType: {
            type: String,
            required: [true, "Establishment type (Cafe or Restaurant) is required"],
        },
        Average_Cost: {
            type: String,
        },
        AboutCafe: {
            type: String,
        },

        // ─── Manager Details ─────────────────────────────────────────
        managerName: {
            type: String,
            trim: true,
        },
        Phonenumber: {
            type: String,
        },
        designation: {
            type: String,
        },
        AlternateContact: {
            type: String,
        },
        email_address_manager: {
            type: String,
            lowercase: true,
            trim: true,
        },

        // ─── Authentication ──────────────────────────────────────────
        password: {
            type: String,
            minlength: 6,
        },
        status: {
            type: Boolean,
            default: false, // false = pending admin approval, true = approved
        },
        role: {
            type: String,
            default: "cafe",
        },

        // ─── Extra Fields (from user request) ────────────────────────
        tables: {
            type: Number,
        },
        minOrderValue: {
            type: Number,
            default: 500, // Meets default threshold
        },

        // ─── Opening Hours ───────────────────────────────────────────
        opening_hours: {
            monday: {
                open: { type: String },
                close: { type: String },
                closed: { type: Boolean, default: false },
            },
            tuesday: daySchema,
            wednesday: daySchema,
            thursday: daySchema,
            friday: daySchema,
            saturday: daySchema,
            sunday: daySchema,
        },

        // ─── Payment & Photos ────────────────────────────────────────
        paymentMethods: {
            type: [String],
        },
        upiIDs: {
            type: [String],
            validate: {
                validator: (v) => new Set(v).size === v.length,
                message: "UPI IDs must be unique",
            },
        },
        upi_photo: {
            type: String, // Cloudinary URL for UPI QR code
        },
        Cafe_photos: {
            type: [String], // Array of Cloudinary URLs/paths
        },
        profilePicture: {
            type: String, // Base64 or URL for the cafe owner's profile picture
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cafe", Cafe_log, "caves");
