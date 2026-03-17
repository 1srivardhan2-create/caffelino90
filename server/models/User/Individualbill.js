const mongoose = require("mongoose");

const individualBillSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupAdmin",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("IndividualBill", individualBillSchema);
