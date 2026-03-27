const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        picture: {
            type: String,
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === "email";
            },
            minlength: 6,
        },
        authProvider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },
        googleId: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "cafe", "owner"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        otpExpiresAt: {
            type: Date,
        },
        // --- Profile Completion Fields ---
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        city: { type: String },
        age: { type: Number },
        mobileNumber: { type: String },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
        meetups: [
            {
                meetupId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Meetup",
                },
                name: String,
                members: Array,
                status: String,
                joinedAt: { type: Date, default: Date.now },
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
