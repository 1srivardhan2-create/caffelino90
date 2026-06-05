const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const QRCode = require("qrcode");
const uploadBuffer = require("../utils/uploadToCloudinary");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// ─── 1. Admin / Organizer: Create Event ─────────────────────────────────────
exports.createEvent = async (req, res) => {
    try {
        // According to user request: Event status should default to "published"
        const eventData = { ...req.body, status: "published" };
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ success: false, message: "Failed to create event" });
    }
};

// ─── 2. Fetch All Events (Categorized) ──────────────────────────────────────
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "published" }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Get All Events Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
};

// ─── 3. Fetch Event by ID ───────────────────────────────────────────────────
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error("Get Event By ID Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch event details" });
    }
};

// ─── 4. Helper: Generate and Upload QR Code ─────────────────────────────────
const generateAndUploadQRCode = async (ticketNumber) => {
    try {
        // Generate QR code as Buffer
        const qrBuffer = await QRCode.toBuffer(ticketNumber, {
            type: "png",
            errorCorrectionLevel: "H",
            width: 300,
            margin: 2,
        });

        // Upload to Cloudinary (using existing helper)
        const qrUrl = await uploadBuffer(qrBuffer, "events/tickets");
        return qrUrl;
    } catch (err) {
        console.error("QR Code Generation/Upload Error:", err);
        throw new Error("Failed to generate QR Code");
    }
};

// ─── 5. Register for Free Event ─────────────────────────────────────────────
exports.registerFreeEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        if (!eventId || !userId) return res.status(400).json({ success: false, message: "Missing eventId or userId" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        
        if (event.ticketPrice > 0) return res.status(400).json({ success: false, message: "This is a paid event" });
        if (event.availableSeats <= 0) return res.status(400).json({ success: false, message: "Event is fully booked" });

        // Check if already registered
        const existing = await EventRegistration.findOne({ eventId, userId });
        if (existing) return res.status(400).json({ success: false, message: "Already registered" });

        // Generate Ticket Number and QR Code
        const ticketNumber = `TKT-${eventId.toString().substring(18).toUpperCase()}-${Date.now().toString().substring(7)}`;
        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);

        const registration = new EventRegistration({
            eventId,
            userId,
            status: "confirmed",
            ticketNumber,
            qrCodeUrl,
            paymentId: "FREE",
            amountPaid: 0,
        });

        await registration.save();

        // Update Seats
        event.availableSeats -= 1;
        event.ticketsSold += 1;
        await event.save();

        res.status(201).json({ success: true, registration, message: "Successfully registered" });
    } catch (error) {
        console.error("Register Free Event Error:", error);
        res.status(500).json({ success: false, message: "Failed to register" });
    }
};

// ─── 6. Register Paid Event (Initiate Payment) ──────────────────────────────
exports.createPaidEventOrder = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        if (!eventId || !userId) return res.status(400).json({ success: false, message: "Missing required fields" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });
        if (event.availableSeats <= 0) return res.status(400).json({ success: false, message: "Event is fully booked" });

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_STzO1DnRlqY3vN",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL",
        });

        // Convert ticketPrice to paise
        const options = {
            amount: event.ticketPrice * 100, 
            currency: "INR",
            receipt: `tkt_rcpt_${Date.now()}`.substring(0, 40),
            notes: { platform: "Caffelino", purpose: "Event Ticket", eventId, userId }
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, orderId: order.id, amount: order.amount });
    } catch (error) {
        console.error("Create Paid Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to initiate payment" });
    }
};

// ─── 7. Register Paid Event (Verify Payment & Confirm) ──────────────────────
exports.verifyAndConfirmPaidRegistration = async (req, res) => {
    try {
        const { eventId, userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL";
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        // Generate Ticket and QR
        const ticketNumber = `TKT-${eventId.toString().substring(18).toUpperCase()}-${Date.now().toString().substring(7)}`;
        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);

        const registration = new EventRegistration({
            eventId,
            userId,
            status: "confirmed",
            ticketNumber,
            qrCodeUrl,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amountPaid: event.ticketPrice,
        });

        await registration.save();

        // Update Seats
        event.availableSeats -= 1;
        event.ticketsSold += 1;
        await event.save();

        res.status(200).json({ success: true, registration, message: "Ticket purchased successfully" });
    } catch (error) {
        console.error("Verify Paid Registration Error:", error);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};

// ─── 8. Fetch User's Tickets ────────────────────────────────────────────────
exports.getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

        const tickets = await EventRegistration.find({ userId })
            .populate("eventId", "bannerUrl eventName date startTime endTime venueName city")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, tickets });
    } catch (error) {
        console.error("Get User Tickets Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tickets" });
    }
};
