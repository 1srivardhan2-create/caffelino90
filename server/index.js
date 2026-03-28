// ─── Load environment variables FIRST ────────────────────────────
require("dotenv").config();

// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]); // Use Google DNS for SRV record resolution

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

// ─── Database connection module ──────────────────────────────────
const { connectDB, requireDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Create HTTP server + Socket.io ──────────────────────────────
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// ─── Route Imports ───────────────────────────────────────────────
const cafeRoutes = require("./routes/Cafe.routes");
const adminRoutes = require("./routes/Admin.routes");
const userRoutes = require("./routes/User.routes");
const chatRoutes = require("./routes/Chat.route");
const authRoutes = require("./routes/Auth.routes");
const meetupRoutes = require("./routes/Meetup.routes");

// ─── Middleware Setup ────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Attach io to every request so controllers can emit socket events
app.use((req, res, next) => {
    req.io = io;
    next();
});

// DB-check middleware: returns 503 if MongoDB isn't connected
app.use("/api", requireDB);

// ─── Route Mounting ──────────────────────────────────────────────
app.use("/api/cafe", cafeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meetups", meetupRoutes);

// Meetup Order management (accept, cash-collected, delete, earnings)
const meetupOrderRoutes = require("./routes/MeetupOrder.routes");
app.use("/api/meetup-orders", meetupOrderRoutes);

// User Notifications
const notificationRoutes = require("./routes/Notification.routes");
app.use("/api/notifications", notificationRoutes);


// Razorpay explicit routes as requested
const { createRazorpayOrder, verifyRazorpayPayment } = require("./controllers/meetup.controller");
app.post("/api/create-order", createRazorpayOrder);
app.post("/api/verify-payment", verifyRazorpayPayment);

// Serve static uploaded files
app.use("/uploads", express.static("uploads"));

// ─── Health check endpoint ───────────────────────────────────────
app.get("/health", (req, res) => {
    const mongoose = require("mongoose");
    res.json({
        status: "ok",
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

// ─── Socket.io Events ────────────────────────────────────────────
io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Join a meetup room
    socket.on("join_meetup_room", (meetupId) => {
        socket.join(meetupId);
        console.log(`📍 Socket ${socket.id} joined room ${meetupId}`);
    });

    // Leave a meetup room
    socket.on("leave_meetup_room", (meetupId) => {
        socket.leave(meetupId);
        console.log(`📍 Socket ${socket.id} left room ${meetupId}`);
    });

    // Real-time chat message
    socket.on("send_message", (data) => {
        io.to(data.meetupId).emit("receive_message", data);
    });

    // Member joined notification
    socket.on("member_joined", (data) => {
        io.to(data.meetupId).emit("member_joined", data);
    });

    // Vote update notification
    socket.on("vote_update", (data) => {
        io.to(data.meetupId).emit("vote_update", data);
    });

    // Order update notification
    socket.on("order_update", (data) => {
        io.to(data.meetupId).emit("order_update", data);
    });

    // ─── Cafe Dashboard: Join cafe room ──────────────────────────
    socket.on("join_cafe_room", async (cafeId) => {
        if (!cafeId) return;

        socket.join(`cafe_${cafeId}`);
        console.log(`☕ Socket ${socket.id} joined cafe room: cafe_${cafeId}`);

        try {
            const Cafe = require("./models/Cafe/Cafe");
            let cafe = null;

            // Try as ID or ownerId
            if (require("mongoose").Types.ObjectId.isValid(cafeId)) {
                cafe = await Cafe.findById(cafeId).lean();
            }
            if (!cafe) {
                cafe = await Cafe.findOne({ ownerId: cafeId }).lean();
            }

            if (cafe) {
                // If we found a cafe, join both its _id and ownerId rooms to be safe
                const rooms = new Set([`cafe_${cafe._id}`, `cafe_${cafe.ownerId}`]);
                rooms.forEach(room => {
                    socket.join(room);
                    console.log(`☕ Socket ${socket.id} also joined: ${room}`);
                });
            }
        } catch (e) {
            console.error("Socket room join error:", e.message);
        }
    });

    socket.on("leave_cafe_room", (cafeId) => {
        socket.leave(`cafe_${cafeId}`);
        console.log(`☕ Socket ${socket.id} left cafe room cafe_${cafeId}`);
    });

    // ─── Order created — forward to cafe dashboard (ONLY paid orders) ───
    socket.on("order-created", (data) => {
        console.log("📦 POS emitted order-created:", data.orderId || data.orderNumber, "status:", data.status);
        // Block unpaid orders from reaching the dashboard
        const paidStatuses = ['token_paid', 'accepted', 'ACCEPTED', 'confirmed', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CASH_COLLECTED', 'TOKEN_PAID'];
        if (data.status && !paidStatuses.includes(data.status)) {
            console.log(`⏳ Blocked order relay (status: ${data.status} — not paid yet)`);
            return;
        }
        if (data.cafeId) {
            io.to(`cafe_${data.cafeId}`).emit("order-created", data);
            console.log(`🎯 Order forwarded to cafe room: cafe_${data.cafeId}`);
        } else {
            console.warn("⚠️ order-created received without cafeId!");
        }
    });

    socket.on("disconnect", () => {
        console.log(`⚡ Socket disconnected: ${socket.id}`);
    });
});

// ─── Start: Connect DB, then start server ────────────────────────
const startServer = async () => {
    // 1. Attempt MongoDB connection (non-blocking — retries in background)
    await connectDB();

    // 2. Start server regardless — it will serve requests once DB connects
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (HTTP + Socket.io)`);
    });
};

startServer();
