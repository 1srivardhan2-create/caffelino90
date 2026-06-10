const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "captured", "failed"], default: "created" },
    paymentDate: { type: Date, default: Date.now },
    transactionId: { type: String, default: () => new mongoose.Types.ObjectId().toString() }
});

module.exports = mongoose.model("Payment", paymentSchema);
