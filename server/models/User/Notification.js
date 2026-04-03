const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            default: "BILL",
        },
        message: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
        cafeName: {
            type: String,
            default: "",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed, // flexible — stores paymentDetails, orderItems, etc.
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
