const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema(
    {
        Fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },

        gender: {
            type: String,
            required: [true, "Gender is required"],
        },
        avatarKey: {
            type: String,
            enum: ["male", "female", "other", "custom"],
            default: "other",
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Userdetail", userDetailSchema);
