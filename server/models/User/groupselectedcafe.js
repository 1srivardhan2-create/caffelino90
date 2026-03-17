const mongoose = require("mongoose");

const groupSelectedCafeSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupAdmin",
            required: true,
            unique: true, // One selected cafe per group
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("GroupSelectedCafe", groupSelectedCafeSchema);
