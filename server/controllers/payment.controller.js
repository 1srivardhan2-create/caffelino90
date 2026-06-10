const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User/User");
const Counter = require("../models/Counter");
const { generateAndUploadQRCode } = require("../utils/qrCodeGenerator");
const mongoose = require("mongoose");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_STzO1DnRlqY3vN",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL",
});

exports.createOrder = async (req, res) => {
    try {
        console.log("--- CREATE ORDER ENDPOINT HIT! ---", req.body);
        const { eventId, userId, quantity } = req.body;
        if (!eventId || !userId) {
            console.error("Missing eventId or userId");
            return res.status(400).json({ success: false, message: "eventId and userId are required" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        
        const numTickets = quantity || 1;
        if (event.availableSeats < numTickets) {
            return res.status(400).json({ success: false, message: "Not enough seats available" });
        }

        const amount = event.ticketPrice * numTickets;

        const options = {
            amount: amount * 100, // paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`.substring(0, 40),
            notes: { eventId, userId, quantity: numTickets }
        };

        const order = await razorpayInstance.orders.create(options);

        // Fetch User Info
        let userObj = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            userObj = await User.findById(userId);
        } else {
            userObj = await User.findOne({ firebaseUid: userId });
        }

        // Initialize Payment record
        console.log('--- INITIALIZING PAYMENT RECORD ---');
        const payment = new Payment({
            eventId: event._id,
            userId: userObj ? userObj._id : new mongoose.Types.ObjectId(), // Just to satisfy schema if firebaseUid
            organizerId: event.organizerId || event._id, // fallback
            razorpayOrderId: order.id,
            amount: amount,
            status: "created"
        });
        await payment.save();
        console.log('--- PAYMENT RECORD CREATED ---', payment._id);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID || "rzp_live_STzO1DnRlqY3vN"
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.webhook = async (req, res) => {
    try {
        // Validation of webhook signature
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL";
        const signature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const eventReceived = req.body.event;
        const payload = req.body.payload;

        if (eventReceived === "payment.captured") {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const paymentId = paymentEntity.id;
            const { eventId, userId, quantity } = paymentEntity.notes;

            console.log('--- WEBHOOK: PAYMENT CAPTURED ---', { orderId, paymentId });

            // Atomic update to prevent race condition with verifyOrder
            const payment = await Payment.findOneAndUpdate(
                { razorpayOrderId: orderId, status: { $ne: "captured" } },
                { status: "captured", razorpayPaymentId: paymentId },
                { returnDocument: 'after' }
            );

            if (payment) {
                console.log('--- WEBHOOK: ATOMIC LOCK ACQUIRED. PROCESSING TICKET ---');
                // Process Event Registration
                const event = await Event.findById(eventId);
                if (event) {
                    const numTickets = parseInt(quantity) || 1;
                    
                    // Fetch User Info gracefully
                    let userObj = null;
                    if (mongoose.Types.ObjectId.isValid(userId)) {
                        userObj = await User.findById(userId);
                    } else {
                        userObj = await User.findOne({ firebaseUid: userId });
                    }

                    // Update revenue and tickets
                    await Event.updateOne(
                        { _id: event._id },
                        { 
                            $inc: { 
                                revenue: payment.amount,
                                ticketsSold: numTickets,
                                availableSeats: -numTickets
                            }
                        }
                    );
                    console.log('--- REVENUE UPDATED ---', (event.revenue || 0) + payment.amount);

                    // Update organizer revenue
                    if (event.organizerId) {
                        await User.findByIdAndUpdate(event.organizerId, {
                            $inc: { revenue: payment.amount }
                        });
                        console.log('--- SETTLEMENT UPDATED FOR ORGANIZER ---');
                    }

                    // Generate registrations
                    for(let i = 0; i < numTickets; i++) {
                        const year = new Date().getFullYear();
                        const counter = await Counter.findByIdAndUpdate(
                            'ticketId',
                            { $inc: { seq: 1 } },
                            { returnDocument: 'after', upsert: true }
                        );
                        const seqFormatted = String(counter.seq).padStart(4, '0');
                        const ticketNumber = `CAF-${year}-${seqFormatted}`;
                        console.log('--- TICKET NUMBER GENERATED ---', ticketNumber);
                        
                        const qrCodeData = JSON.stringify({ ticketNumber, eventId, userId });
                        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);
                        console.log('--- QR CODE UPLOADED ---', qrCodeUrl);

                        const registration = new EventRegistration({
                            eventId,
                            eventName: event.eventName,
                            userId,
                            userName: userObj ? (userObj.name || userObj.username || "Guest") : "Guest",
                            email: userObj ? (userObj.email || "") : "",
                            mobileNumber: userObj ? (userObj.mobileNumber || "") : "",
                            profileImage: userObj ? (userObj.picture || userObj.avatarId || "") : "",
                            status: "confirmed",
                            ticketNumber,
                            qrCodeUrl,
                            qrCodeData,
                            ticketType: "PAID",
                            paymentId: paymentId,
                            orderId: orderId,
                            ticketPrice: event.ticketPrice,
                            amountPaid: event.ticketPrice,
                        });
                        await registration.save();
                        console.log('--- REGISTRATION CREATED ---', registration._id);
                    }
                }
            } else {
                console.log('--- WEBHOOK: PAYMENT ALREADY PROCESSED BY VERIFY ENDPOINT ---');
            }
        } else if (eventReceived === "payment.failed") {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            
            await Payment.findOneAndUpdate(
                { razorpayOrderId: orderId },
                { status: "failed", razorpayPaymentId: paymentEntity.id }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Also an endpoint to get payment history for Admin
exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find().populate("eventId", "eventName").populate("userId", "name username").sort({ paymentDate: -1 });
        
        const formatted = payments.map(p => ({
            id: p._id,
            userName: p.userId ? (p.userId.name || p.userId.username) : "Unknown",
            eventName: p.eventId ? p.eventId.eventName : "Unknown",
            amount: p.amount,
            razorpayPaymentId: p.razorpayPaymentId || "N/A",
            status: p.status,
            date: p.paymentDate
        }));

        res.status(200).json({ success: true, payments: formatted });
    } catch (error) {
        console.error("Get Payment History Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, userId, quantity } = req.body;
        
        const secret = process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL";
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        console.log('--- VERIFY ORDER HIT ---', { razorpay_order_id, razorpay_payment_id });

        const paymentCheck = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (!paymentCheck) return res.status(404).json({ success: false, message: "Payment record not found" });

        // Atomic update to ensure only ONE endpoint generates the ticket
        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id, status: { $ne: "captured" } },
            { 
                status: "captured", 
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            },
            { returnDocument: 'after' }
        );

        // If payment is NOT null, it means WE successfully acquired the lock to process it!
        if (payment) {
            console.log('--- VERIFY ORDER: ATOMIC LOCK ACQUIRED. PROCESSING TICKET ---');
            const event = await Event.findById(eventId);
            if (event) {
                const numTickets = parseInt(quantity) || 1;
                
                let userObj = null;
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    userObj = await User.findById(userId);
                } else {
                    userObj = await User.findOne({ firebaseUid: userId });
                }

                // Update revenue and tickets
                await Event.updateOne(
                    { _id: event._id },
                    { 
                        $inc: { 
                            revenue: payment.amount,
                            ticketsSold: numTickets,
                            availableSeats: -numTickets
                        }
                    }
                );
                console.log('--- REVENUE UPDATED ---', (event.revenue || 0) + payment.amount);

                if (event.organizerId) {
                    await User.findByIdAndUpdate(event.organizerId, {
                        $inc: { revenue: payment.amount }
                    });
                    console.log('--- SETTLEMENT UPDATED FOR ORGANIZER ---');
                }

                for(let i = 0; i < numTickets; i++) {
                    const year = new Date().getFullYear();
                    const counter = await Counter.findByIdAndUpdate(
                        'ticketId',
                        { $inc: { seq: 1 } },
                        { returnDocument: 'after', upsert: true }
                    );
                    const seqFormatted = String(counter.seq).padStart(4, '0');
                    const ticketNumber = `CAF-${year}-${seqFormatted}`;
                    console.log('--- TICKET NUMBER GENERATED ---', ticketNumber);
                    
                    const qrCodeData = JSON.stringify({ ticketNumber, eventId, userId });
                    const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);
                    console.log('--- QR CODE UPLOADED ---', qrCodeUrl);

                    const registration = new EventRegistration({
                        eventId,
                        eventName: event.eventName,
                        userId,
                        userName: userObj ? (userObj.name || userObj.username || "Guest") : "Guest",
                        email: userObj ? (userObj.email || "") : "",
                        mobileNumber: userObj ? (userObj.mobileNumber || "") : "",
                        profileImage: userObj ? (userObj.picture || userObj.avatarId || "") : "",
                        status: "confirmed",
                        ticketNumber,
                        qrCodeUrl,
                        qrCodeData,
                        ticketType: "PAID",
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id,
                        ticketPrice: event.ticketPrice,
                        amountPaid: event.ticketPrice,
                    });
                    await registration.save();
                    console.log('--- REGISTRATION CREATED ---', registration._id);
                }
            }
        } else {
            console.log('--- VERIFY ORDER: PAYMENT ALREADY PROCESSED BY WEBHOOK ---');
        }
        res.status(200).json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Verify Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getRevenueStats = async (req, res) => {
    try {
        const events = await Event.find().select("eventName ticketsSold revenue");
        const payments = await Payment.countDocuments({ status: "captured" });
        const totalRevenue = events.reduce((acc, e) => acc + (e.revenue || 0), 0);
        const totalTickets = events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);

        res.status(200).json({
            success: true,
            totalRevenue,
            totalTickets,
            paymentCount: payments,
            eventStats: events
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
