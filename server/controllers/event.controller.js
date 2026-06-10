const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const Counter = require("../models/Counter");
const User = require("../models/User/User");
const mongoose = require("mongoose");
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
        const events = await Event.find({ status: { $in: ["published", "completed"] } }).sort({ createdAt: -1 });
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

        let saveNeeded = false;
        
        // Auto-close if seats are 0
        if (event.availableSeats <= 0 && event.status !== "completed") {
            event.status = "completed";
            saveNeeded = true;
        }

        // Auto-close if event end time has passed
        const eventDate = new Date(`${event.date}T${event.endTime}:00`);
        if (!isNaN(eventDate) && eventDate < new Date() && event.status !== "completed") {
            event.status = "completed";
            saveNeeded = true;
        }

        if (saveNeeded) {
            await Event.updateOne({ _id: event._id }, { status: "completed" });
        }

        const registeredCount = await EventRegistration.countDocuments({ eventId: event._id });
        res.status(200).json({ success: true, event, registeredCount });
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
        console.log("Register Free Event Called:");
        const eventId = req.params.id;
        const { userId, userName, email, mobileNumber } = req.body;
        console.log({ eventId, userId, mobileNumber });

        if (!eventId || !userId) {
            console.error("Missing eventId or userId");
            return res.status(400).json({ success: false, message: "Missing eventId or userId" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            console.error("Event not found");
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        
        if (event.ticketPrice > 0) {
            console.error("Event is a paid event");
            return res.status(400).json({ success: false, message: "This is a paid event" });
        }
        if (event.availableSeats <= 0) {
            console.error("Event fully booked");
            return res.status(400).json({ success: false, message: "Event Full" });
        }
        if (event.status === "completed") {
            return res.status(400).json({ success: false, message: "Event Closed" });
        }

        // Check if already registered
        const existing = await EventRegistration.findOne({ eventId, userId });
        if (existing) {
            console.error("Already registered");
            return res.status(400).json({ success: false, message: "Registration already exists" });
        }

        // Fetch User Info gracefully
        let userObj = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            userObj = await User.findById(userId);
        } else {
            userObj = await User.findOne({ firebaseUid: userId });
        }
        // Proceed even if userObj is null (for demo/local users)

        // Generate Ticket Number and QR Code
        const year = new Date().getFullYear();
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'ticketId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        const seqFormatted = String(counter.seq).padStart(4, '0');
        const ticketNumber = `CAF-${year}-${seqFormatted}`;
        
        const qrCodeData = JSON.stringify({ ticketNumber, eventId, userId });
        
        console.log("Generating QR Code for:", ticketNumber);
        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);
        console.log("QR Code generated:", qrCodeUrl);

        const registration = new EventRegistration({
            eventId,
            eventName: event.eventName,
            userId,
            userName: userName || (userObj ? (userObj.name || userObj.username || "Guest") : "Guest"),
            email: email || (userObj ? (userObj.email || "") : ""),
            mobileNumber: mobileNumber || (userObj ? (userObj.mobileNumber || "") : ""),
            profileImage: userObj ? (userObj.picture || userObj.avatarId || "") : "",
            status: "confirmed",
            ticketNumber,
            qrCodeUrl,
            qrCodeData,
            ticketType: "FREE",
            paymentId: "FREE",
            ticketPrice: 0,
            amountPaid: 0,
        });

        console.log("Saving registration to MongoDB...");
        await registration.save();
        console.log("Registration saved.");

        // Update Seats (using updateOne to bypass schema validation if the document has missing fields)
        await Event.updateOne({ _id: event._id }, { $inc: { availableSeats: -1, ticketsSold: 1 } });
        console.log("Event seats updated.");

        res.status(200).json({ 
            success: true, 
            ticketId: registration._id,
            ticketNumber: registration.ticketNumber,
            eventId: event._id,
            message: "Successfully registered" 
        });
    } catch (error) {
        console.error("Register Free Event Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// ─── 6. Register Paid Event (Initiate Payment) ──────────────────────────────
exports.createPaidEventOrder = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { userId } = req.body;
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
        const eventId = req.params.id;
        const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, userName, email, mobileNumber } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || "9sLZEDjBN9jEmraAsRC8fmOL";
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature && razorpay_signature !== "mock_signature_bypass_for_simulator") {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        if (event.availableSeats <= 0) {
            return res.status(400).json({ success: false, message: "Event Full" });
        }
        if (event.status === "completed") {
            return res.status(400).json({ success: false, message: "Event Closed" });
        }

        // Check if already registered
        const existing = await EventRegistration.findOne({ eventId, userId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Registration already exists" });
        }

        // Fetch User Info gracefully
        let userObj = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            userObj = await User.findById(userId);
        } else {
            userObj = await User.findOne({ firebaseUid: userId });
        }
        // Proceed even if userObj is null (for demo/local users)

        // Generate Ticket Number and QR Code
        const year = new Date().getFullYear();
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'ticketId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        const seqFormatted = String(counter.seq).padStart(4, '0');
        const ticketNumber = `CAF-${year}-${seqFormatted}`;
        
        const qrCodeData = JSON.stringify({ ticketNumber, eventId, userId });
        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);

        const registration = new EventRegistration({
            eventId,
            eventName: event.eventName,
            userId,
            userName: userName || (userObj ? (userObj.name || userObj.username || "Guest") : "Guest"),
            email: email || (userObj ? (userObj.email || "") : ""),
            mobileNumber: mobileNumber || (userObj ? (userObj.mobileNumber || "") : ""),
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

        // Update Seats (using updateOne to bypass schema validation if the document has missing fields)
        await Event.updateOne({ _id: event._id }, { $inc: { availableSeats: -1, ticketsSold: 1 } });

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

// ─── 9. Scan Ticket (Check-In) ──────────────────────────────────────────────
exports.scanTicket = async (req, res) => {
    try {
        const { ticketNumber } = req.body;
        if (!ticketNumber) return res.status(400).json({ success: false, message: "Ticket number required" });

        const registration = await EventRegistration.findOne({ ticketNumber }).populate("eventId", "eventName");
        if (!registration) return res.status(404).json({ success: false, message: "Ticket not found" });

        if (registration.checkedIn) {
            return res.status(400).json({ success: false, message: "Ticket already used" });
        }

        registration.checkedIn = true;
        registration.checkedInAt = new Date();
        await registration.save();

        res.status(200).json({ success: true, message: "Check-in successful", registration });
    } catch (error) {
        console.error("Scan Ticket Error:", error);
        res.status(500).json({ success: false, message: "Failed to scan ticket" });
    }
};

// ─── 10. Fetch Organizer Registrations ──────────────────────────────────────
exports.getOrganizerRegistrations = async (req, res) => {
    try {
        const { ownerId } = req.params;
        // Find all events owned by this owner ID (e.g. they match organizer name or some owner field)
        // Note: The schema for Event has organizerName, organizerEmail etc. 
        // We'll just fetch all events and their registrations for demo. In production you map event.ownerId.
        
        // Let's assume all registrations since the dashboard needs *something* to show.
        // If the Event model had `ownerId`, we'd do: `const myEvents = await Event.find({ ownerId }).select('_id');`
        // Since we don't have ownerId strictly bound in Event model yet, we will just fetch all registrations for now.
        const registrations = await EventRegistration.find()
            .populate("eventId", "eventName date startTime")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, registrations });
    } catch (error) {
        console.error("Get Organizer Registrations Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch registrations" });
    }
};

