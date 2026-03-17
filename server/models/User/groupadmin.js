const mongoose = require("mongoose");

const groupAdminSchema = new mongoose.Schema(
    {
        admin_name: {
            type: String,
            required: [true, "Admin name is required"],
            trim: true,
        },
        admin_mobileno: {
            type: Number,
            required: [true, "Admin mobile number is required"],
        },
        group_name: {
            type: String,
            required: [true, "Group name is required"],
            trim: true,
        },
        select_date: {
            type: String,
            required: [true, "Date is required"],
        },
        select_time: {
            type: String,
            required: [true, "Time is required"],
        },
        joincode: {
            type: String,
            required: true,
            unique: true,
        },
        cafes: {
            type: [String],
            required: [true, "At least one cafe must be added"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        selectedCafes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cafe",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("GroupAdmin", groupAdminSchema);
