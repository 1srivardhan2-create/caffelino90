const Meetup = require("../models/Meetup/Meetup");
const MeetupMessage = require("../models/Meetup/MeetupMessage");
const MeetupOrder = require("../models/Meetup/MeetupOrder");
const CafeMenu = require("../models/Cafe/cafe_menu");
const Order = require("../models/Cafe/Cafe_orders");
const Cafe = require("../models/Cafe/Cafe_login");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User/User");
const Notification = require("../models/User/Notification");

// ─── Helper: Generate random meetup code ─────────────────────────
function generateMeetupCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ─── CREATE MEETUP ───────────────────────────────────────────────
const createMeetup = async (req, res) => {
    try {
        const { title, organizerId, organizerName, organizerAvatarId, date, time } = req.body;

        if (!title || !organizerId || !organizerName) {
            return res.status(400).json({ message: "title, organizerId, and organizerName are required" });
        }

        // Generate unique meetup code (retry if collision)
        let meetupCode;
        let isUnique = false;
        while (!isUnique) {
            meetupCode = generateMeetupCode();
            const existing = await Meetup.findOne({ meetupCode });
            if (!existing) isUnique = true;
        }

        const meetup = await Meetup.create({
            meetupCode,
            title,
            organizerId: String(organizerId),
            organizerName,
            date: date || "",
            time: time || "",
            members: [
                {
                    userId: organizerId,
                    name: organizerName,
                    avatarId: organizerAvatarId || undefined,
                    joinedAt: new Date(),
                },
            ],
            cafesForVoting: [],
            votes: [],
            selectedCafe: null,
            status: "active",
        });

        console.log(`🎉 Meetup created: ${title} (${meetupCode}) by ${organizerName}`);

        // Persist meetup in User document
        if (mongoose.Types.ObjectId.isValid(organizerId)) {
            await User.findByIdAndUpdate(organizerId, {
                $push: { meetups: { meetupId: meetup._id, name: meetup.title, members: meetup.members, status: meetup.status } }
            });
        }

        res.status(201).json({
            success: true,
            message: "Meetup created successfully",
            meetup,
        });
    } catch (error) {
        console.error("Create Meetup Error:", error);
        res.status(500).json({ message: "Failed to create meetup", error: error.message });
    }
};

// ─── JOIN MEETUP ─────────────────────────────────────────────────
const joinMeetup = async (req, res) => {
    try {
        const { meetupCode, userId, name, avatarId } = req.body;

        if (!meetupCode || !userId || !name) {
            return res.status(400).json({ message: "meetupCode, userId, and name are required" });
        }

        const meetup = await Meetup.findOne({ meetupCode: meetupCode.toUpperCase() });

        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found. Check your code." });
        }

        // Check if user already a member (considering name too, to allow local testing from same machine)
        const alreadyMember = meetup.members.some((m) => m.userId === userId && m.name === name);
        if (alreadyMember) {
            return res.json({
                success: true,
                message: "You are already a member of this meetup",
                meetup,
            });
        }

        // Use standard MongoDB push + save as per standard pattern
        meetup.members.push({ userId, name, avatarId: avatarId || undefined, joinedAt: new Date() });
        await meetup.save();

        console.log(`👤 ${name} joined meetup ${meetupCode}`);

        // Persist meetup in User document
        if (mongoose.Types.ObjectId.isValid(userId)) {
            await User.findByIdAndUpdate(userId, {
                $push: { meetups: { meetupId: meetup._id, name: meetup.title, members: meetup.members, status: meetup.status } }
            });
        }

        // Emit socket event for LIVE MEMBERS SYNC
        if (req.io) {
            req.io.to(meetup._id.toString()).emit("member_joined", {
                members: meetup.members,
                membersCount: meetup.members.length,
                userId,
                name,
                meetupId: meetup._id,
                meetup: meetup,
                message: `${name} joined the meetup!`
            });
        }

        res.json({
            success: true,
            message: `Successfully joined meetup: ${meetup.title}`,
            meetup: meetup,
            members: meetup.members,
            membersCount: meetup.members.length,
        });
    } catch (error) {
        console.error("Join Meetup Error:", error);
        res.status(500).json({ message: "Failed to join meetup", error: error.message });
    }
};

// ─── GET MEETUP BY ID ────────────────────────────────────────────
const getMeetupById = async (req, res) => {
    try {
        const meetup = await Meetup.findById(req.params.id);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        const members = meetup.members || [];
        const membersCount = members.length;

        res.json({
            success: true,
            meetup,
            members,
            membersCount,
            totalAmount: meetup.totalAmount || 0,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── LEAVE MEETUP ────────────────────────────────────────────────
const leaveMeetup = async (req, res) => {
    try {
        const { meetupId, userId } = req.body;

        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // If organizer leaves, delete the entire meetup
        if (meetup.organizerId === userId) {
            await Meetup.findByIdAndDelete(meetupId);
            // Optionally clean up messages associated with this meetup
            await MeetupMessage.deleteMany({ meetupId });
            // DO NOT delete orders so they persist for the cafe dashboard
            
            console.log(`🗑️ Organizer left: Meetup ${meetup.meetupCode} deleted`);
            return res.json({ success: true, message: "Meetup deleted because organizer left", deleted: true });
        }

        // Otherwise, just remove the user from members array
        meetup.members = meetup.members.filter(m => m.userId !== userId);
        
        // Remove their vote if they had one
        if (meetup.votes) {
            meetup.votes = meetup.votes.filter(v => v.userId !== userId);
        }

        await meetup.save();

        console.log(`👤 User ${userId} left meetup ${meetup.meetupCode}`);
        
        // Let others know someone left
        if (req.io) {
            req.io.to(meetupId).emit("member_left", {
                userId,
                meetupId,
                members: meetup.members,
                message: "A member has left the meetup."
            });
        }

        res.json({ success: true, message: "Successfully left the meetup", meetup });
    } catch (error) {
        console.error("Leave Meetup Error:", error);
        res.status(500).json({ message: "Failed to leave meetup", error: error.message });
    }
};

// ─── GET MEETUP BY CODE ──────────────────────────────────────────
const getMeetupByCode = async (req, res) => {
    try {
        const meetup = await Meetup.findOne({ meetupCode: req.params.code.toUpperCase() });
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }
        res.json({ success: true, meetup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── GET ALL MEETUPS FOR A USER ──────────────────────────────────
const getUserMeetups = async (req, res) => {
    try {
        const { userId } = req.params;
        const meetups = await Meetup.find({ "members.userId": userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, meetups });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── GET ALL MEETUPS ─────────────────────────────────────────────
const getAllMeetups = async (req, res) => {
    try {
        const meetups = await Meetup.find().sort({ createdAt: -1 });
        res.json({ success: true, meetups });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── COUNT MEETUPS ───────────────────────────────────────────────
const countMeetups = async (req, res) => {
    try {
        const totalMeetups = await Meetup.countDocuments();
        res.json({ success: true, totalMeetups });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── SEND CHAT MESSAGE ──────────────────────────────────────────
// NOTE: Only saves to DB. Socket broadcast is handled by the
//       socket.on('send_message') handler in index.js to avoid
//       duplicate messages.
const sendMessage = async (req, res) => {
    try {
        const { meetupId, userId, userName, avatarId, message, type, billData, paymentData } = req.body;

        if (!meetupId || !userId || !userName) {
            return res.status(400).json({ message: "meetupId, userId, and userName are required" });
        }

        const msgType = type || 'user';
        if ((msgType === 'user' || msgType === 'system') && !message) {
            return res.status(400).json({ message: "message string is required for user/system messages" });
        }

        // Clean up previous instances of this order's bills/split messages to prevent duplicates on edit
        if (billData && billData.orderId) {
            await MeetupMessage.deleteMany({
                meetupId,
                "billData.orderId": billData.orderId
            });
        }

        const msg = await MeetupMessage.create({
            meetupId,
            userId,
            userName,
            avatarId: avatarId || undefined,
            message: message || '',
            type: msgType,
            billData: billData || undefined,
            paymentData: paymentData || undefined,
        });

        // DO NOT emit via socket here — the frontend emits 'send_message'
        // which is broadcast by the socket handler in index.js.
        // Emitting here too caused the double-message bug.

        res.status(201).json({ success: true, message: msg });
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

// ─── GET MESSAGES FOR A MEETUP ───────────────────────────────────
const getMessages = async (req, res) => {
    try {
        const { meetupId } = req.params;
        const messages = await MeetupMessage.find({ meetupId })
            .sort({ createdAt: 1 })
            .limit(500);
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── ADD CAFES FOR VOTING ────────────────────────────────────────
const addCafesForVoting = async (req, res) => {
    try {
        const { meetupId, cafes } = req.body;

        if (!meetupId || !cafes || !Array.isArray(cafes)) {
            return res.status(400).json({ message: "meetupId and cafes array are required" });
        }

        const meetup = await Meetup.findByIdAndUpdate(
            meetupId,
            {
                cafesForVoting: cafes,
                status: "voting",
                votes: [], // Reset votes when new cafes are added
                selectedCafe: null,
            },
            { new: true }
        );

        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // Emit voting started event
        if (req.io) {
            req.io.to(meetupId).emit("voting_started", {
                meetupId,
                cafesForVoting: cafes,
            });
        }

        console.log(`🗳️ Voting started for meetup ${meetup.meetupCode} with ${cafes.length} cafés`);

        res.json({ success: true, meetup });
    } catch (error) {
        console.error("Add Cafes Error:", error);
        res.status(500).json({ message: "Failed to add cafes", error: error.message });
    }
};

// ─── VOTE FOR A CAFE ─────────────────────────────────────────────
const voteCafe = async (req, res) => {
    try {
        const { meetupId, userId, cafeId } = req.body;

        if (!meetupId || !userId || !cafeId) {
            return res.status(400).json({ message: "meetupId, userId, and cafeId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // Remove existing vote by this user (change vote)
        meetup.votes = meetup.votes.filter((v) => v.userId !== userId);

        // Add new vote
        meetup.votes.push({ userId, cafeId });

        // Count votes per cafe
        const voteCounts = {};
        meetup.votes.forEach((v) => {
            voteCounts[v.cafeId] = (voteCounts[v.cafeId] || 0) + 1;
        });

        // Find the winning cafe (most votes)
        let maxVotes = 0;
        let winningCafeId = null;
        for (const [cId, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
                maxVotes = count;
                winningCafeId = cId;
            }
        }

        // Auto-select winning cafe if all members have voted
        const totalMembers = meetup.members.length;
        const totalVotes = meetup.votes.length;

        if (totalVotes >= totalMembers && winningCafeId) {
            const winningCafe = meetup.cafesForVoting.find(
                (c) => c.cafeId === winningCafeId
            );
            meetup.selectedCafe = winningCafe || { cafeId: winningCafeId };
            meetup.status = "ordering";
        }

        await meetup.save();

        // Emit vote update
        if (req.io) {
            req.io.to(meetupId).emit("vote_update", {
                meetupId,
                votes: meetup.votes,
                voteCounts,
                selectedCafe: meetup.selectedCafe,
                status: meetup.status,
            });
        }

        res.json({
            success: true,
            meetup,
            voteCounts,
        });
    } catch (error) {
        console.error("Vote Cafe Error:", error);
        res.status(500).json({ message: "Failed to vote", error: error.message });
    }
};

// ─── END VOTING (Admin Only) ─────────────────────────────────────
const endVoting = async (req, res) => {
    try {
        const { meetupId, userId } = req.body;

        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // Admin check
        if (meetup.organizerId !== userId) {
            return res.status(403).json({ message: "Only the admin can end voting" });
        }

        // Count votes per cafe
        const voteCounts = {};
        meetup.votes.forEach((v) => {
            voteCounts[v.cafeId] = (voteCounts[v.cafeId] || 0) + 1;
        });

        // Find the winning cafe (most votes, random tiebreaker)
        let maxVotes = 0;
        let winners = [];
        for (const [cId, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
                maxVotes = count;
                winners = [cId];
            } else if (count === maxVotes) {
                winners.push(cId);
            }
        }

        // Random tiebreaker
        const winningCafeId = winners[Math.floor(Math.random() * winners.length)];
        const winningCafe = meetup.cafesForVoting.find(
            (c) => c.cafeId === winningCafeId
        );

        meetup.selectedCafe = winningCafe || { cafeId: winningCafeId };
        meetup.status = "ordering";

        await meetup.save();

        // Emit voting ended event
        if (req.io) {
            req.io.to(meetupId).emit("voting_ended", {
                meetupId,
                selectedCafe: meetup.selectedCafe,
                voteCounts,
                status: meetup.status,
            });
        }

        console.log(`🏆 Voting ended for meetup ${meetup.meetupCode}. Winner: ${winningCafe?.cafeName || winningCafeId}`);

        res.json({
            success: true,
            meetup,
            voteCounts,
            selectedCafe: meetup.selectedCafe,
        });
    } catch (error) {
        console.error("End Voting Error:", error);
        res.status(500).json({ message: "Failed to end voting", error: error.message });
    }
};

// ─── SELECT CAFE (Direct selection without voting) ────────────────
const selectCafe = async (req, res) => {
    try {
        const { meetupId, userId, cafe } = req.body;

        if (!meetupId || !userId || !cafe) {
            return res.status(400).json({ message: "meetupId, userId, and cafe are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // Admin check
        if (meetup.organizerId !== userId) {
            return res.status(403).json({ message: "Only the admin can select a cafe" });
        }

        // Direct selection sets cafe and changes status to ordering
        meetup.selectedCafe = cafe;
        meetup.status = "ordering";

        await meetup.save();

        // Emit cafe selected event
        if (req.io) {
            req.io.to(meetupId).emit("cafe_selected", {
                meetupId,
                selectedCafe: meetup.selectedCafe,
                status: meetup.status,
            });
        }

        console.log(`☕ Café selected directly for meetup ${meetup.meetupCode}: ${cafe.name || cafe.cafeName || cafe.id}`);

        res.json({
            success: true,
            meetup,
            selectedCafe: meetup.selectedCafe,
        });
    } catch (error) {
        console.error("Select Cafe Error:", error);
        res.status(500).json({ message: "Failed to select cafe", error: error.message });
    }
};

// ─── GET CAFE MENU FOR MEETUP ────────────────────────────────────
// Fetches the real menu for the selected café from the CafeMenu collection
const getCafeMenu = async (req, res) => {
    try {
        const { meetupId } = req.params;

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        if (!meetup.selectedCafe || !meetup.selectedCafe.cafeId) {
            return res.status(400).json({ message: "No café selected for this meetup" });
        }

        const cafeId = meetup.selectedCafe.cafeId;

        // Try to find menu items using cafe ObjectId or ownerId
        let menuItems = [];
        const lookupIds = [cafeId];

        // Build list of valid ObjectIds to query
        const validObjectIds = [];
        for (const id of lookupIds) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                validObjectIds.push(new mongoose.Types.ObjectId(id));
            }
        }

        if (validObjectIds.length > 0) {
            menuItems = await CafeMenu.find({
                cafe_owner: { $in: validObjectIds },
                available: true,
            })
                .select("item_name Category food_type price description_food image_url available cafe_owner")
                .lean();
        }

        // Group menu items by Category
        const menuByCategory = {};
        menuItems.forEach((item) => {
            const category = item.Category || "Other";
            if (!menuByCategory[category]) menuByCategory[category] = [];
            menuByCategory[category].push({
                id: item._id.toString(),
                name: item.item_name,
                price: item.price,
                image: item.image_url || "",
                category: item.Category,
                foodType: item.food_type,
                description: item.description_food || "",
                isVeg: item.food_type === "Veg",
            });
        });

        console.log(`📋 Fetched ${menuItems.length} menu items for café ${cafeId}`);

        res.json({
            success: true,
            menuItems: menuItems.map((item) => ({
                id: item._id.toString(),
                name: item.item_name,
                price: item.price,
                image: item.image_url || "",
                category: item.Category,
                foodType: item.food_type,
                description: item.description_food || "",
                isVeg: item.food_type === "Veg",
            })),
            menuByCategory,
            cafeId,
            cafeName: meetup.selectedCafe.cafeName || "",
        });
    } catch (error) {
        console.error("Get Cafe Menu Error:", error);
        res.status(500).json({ message: "Failed to get cafe menu", error: error.message });
    }
};

// ─── VALID COUPONS (official: LINO9 only) ────────────────────────
const VALID_COUPONS = {
    LINO9: { type: "percent", value: 9, minOrder: 0 },
};

const PREMIUM_CAFE_MIN_ORDER = 500;
const STANDARD_CAFE_MIN_ORDER = 300;

function getMinimumOrderForCafe(cafeName = "") {
    const name = String(cafeName).trim().toLowerCase();
    if (
        name.includes("chocolate room") ||
        name.includes("kaapiya")
    ) {
        return PREMIUM_CAFE_MIN_ORDER;
    }
    if (
        name.includes("living room") ||
        name.includes("alkemy")
    ) {
        return STANDARD_CAFE_MIN_ORDER;
    }
    return STANDARD_CAFE_MIN_ORDER;
}

function computeCouponDiscount(code, subtotal) {
    const upperCode = code.trim().toUpperCase();
    const rule = VALID_COUPONS[upperCode];
    if (!rule) return null;
    if (subtotal < (rule.minOrder || 0)) {
        return { error: `Minimum order ₹${rule.minOrder} required for this coupon` };
    }
    let discount =
        rule.type === "percent"
            ? parseFloat(((subtotal * rule.value) / 100).toFixed(2))
            : rule.value;
    discount = Math.min(discount, subtotal);
    return { code: upperCode, discount, rule };
}

// ─── APPLY COUPON ────────────────────────────────────────────────
const applyCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const result = computeCouponDiscount(code, subtotal || 0);
        if (!result) {
            return res.status(400).json({ success: false, message: "Invalid coupon code" });
        }
        if (result.error) {
            return res.status(400).json({ success: false, message: result.error });
        }

        console.log(`🎫 Coupon ${result.code} validated: ₹${result.discount} off`);

        res.json({
            success: true,
            code: result.code,
            discount: result.discount,
            discountType: result.rule.type,
            message: `Coupon applied! ₹${result.discount} off`,
        });
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ message: "Failed to apply coupon", error: error.message });
    }
};

// ─── TABLE RESERVATION (₹20 — host only) ─────────────────────────
const confirmTableReservation = async (req, res) => {
    try {
        const { meetupId, userId, userName, demo } = req.body;

        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        if (String(meetup.organizerId) !== String(userId)) {
            return res.status(403).json({ message: "Only the meetup host can pay the reservation fee" });
        }

        if (meetup.reservationFeePaid) {
            return res.json({
                success: true,
                alreadyPaid: true,
                tableNumber: meetup.tableNumber,
                meetup,
            });
        }

        const tableNumber =
            meetup.tableNumber ||
            `T-${Math.floor(Math.random() * 12) + 1}`;

        meetup.reservationFeePaid = true;
        meetup.reservationFeeAmount = 20;
        meetup.tableNumber = tableNumber;
        meetup.status = "confirmed";
        meetup.billLocked = true;
        await meetup.save();

        const cafeName =
            meetup.selectedCafe?.cafeName ||
            meetup.selectedCafe?.name ||
            "Café";
        const cafeId = meetup.selectedCafe?.cafeId;

        await MeetupMessage.updateMany(
            { meetupId, type: "bill", "billData.cardType": { $in: ["meetup_bill", "order_placed"] } },
            { $set: { "billData.locked": true, "billData.billStatus": "locked" } },
        );

        const pendingOrders = await MeetupOrder.find({
            meetupId,
            status: { $in: ["BILL_PENDING", "PENDING", "PLACED"] },
        });

        for (const order of pendingOrders) {
            order.status = "CONFIRMED";
            order.orderStatus = "CONFIRMED";
            await order.save();

            if (req.io && cafeId) {
                req.io.to(`cafe_${cafeId}`).emit("order-created", {
                    orderId: order.orderId,
                    meetupId: String(meetupId),
                    cafeId,
                    memberCount: meetup.members?.length || 1,
                    items: (order.items || []).map((i) => ({
                        name: i.name,
                        quantity: i.quantity || 1,
                        price: i.price || 0,
                    })),
                    totalAmount: order.total,
                    subtotal: order.subtotal,
                    cgst: order.cgst,
                    sgst: order.sgst,
                    tableNumber,
                    reservationFeePaid: true,
                    adminName: meetup.organizerName,
                });
            }
        }

        const confirmMsg = await MeetupMessage.create({
            meetupId,
            userId: String(userId),
            userName: userName || meetup.organizerName || "Host",
            message: "Meetup confirmed",
            type: "bill",
            billData: {
                cardType: "meetup_confirmed",
                cafeName,
                tableNumber,
                reservationFee: 20,
            },
        });

        const lockMsg = await MeetupMessage.create({
            meetupId,
            userId: String(userId),
            userName: userName || meetup.organizerName || "Host",
            message: "Order locked",
            type: "bill",
            billData: {
                cardType: "order_locked",
                tableNumber,
            },
        });

        if (req.io) {
            req.io.to(meetupId).emit("receive_message", confirmMsg);
            req.io.to(meetupId).emit("receive_message", lockMsg);
            if (cafeId) {
                req.io.to(`cafe_${cafeId}`).emit("meetup_booking", {
                    meetupId,
                    meetupCode: meetup.meetupCode,
                    title: meetup.title,
                    host: meetup.organizerName,
                    memberCount: meetup.members?.length || 1,
                    date: meetup.date,
                    time: meetup.time,
                    reservationFeePaid: true,
                    tableNumber,
                    status: "confirmed",
                });
            }
        }

        console.log(
            `☕ Table reserved for meetup ${meetup.meetupCode}: ${tableNumber}${demo ? " (demo)" : ""}`,
        );

        res.json({
            success: true,
            tableNumber,
            reservationFeeAmount: 20,
            meetup,
            message: confirmMsg,
        });
    } catch (error) {
        console.error("Confirm Table Reservation Error:", error);
        res.status(500).json({
            message: "Failed to confirm table reservation",
            error: error.message,
        });
    }
};

function formatDisplayOrderId(orderId = "") {
    const digits = String(orderId).replace(/\D/g, "");
    if (digits.length >= 6) return digits.slice(-6);
    return String(orderId).slice(-6).toUpperCase() || "------";
}

async function postOrderBillMessage(meetupId, userId, userName, order, extras = {}) {
    require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] 🛠️ inside postOrderBillMessage... orderId: ${order.orderId}\n`);
    try {
        const cgst = order.cgst || 0;
        const sgst = order.sgst || 0;
        const memberCount = extras.memberCount || 1;
        const finalAmount = order.total || 0;
        const splitEnabled = extras.splitEnabled === true;
        const perPerson = splitEnabled
            ? extras.perPersonAmount ||
              (memberCount > 0
                  ? Math.round((finalAmount / memberCount) * 100) / 100
                  : finalAmount)
            : finalAmount;

        require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] 🛠️ Calling MeetupMessage.create...\n`);
        const billMsg = await MeetupMessage.create({
            meetupId,
            userId: String(userId),
        userName,
        message: "Bill generated",
        type: "bill",
        billData: {
            cardType: "meetup_bill",
            orderId: order.orderId,
            displayOrderId: formatDisplayOrderId(order.orderId),
            cafeName: extras.cafeName || "",
            orderedBy: userName,
            billCreatorId: String(userId),
            items: (order.items || []).map((i) => ({
                name: i.name,
                quantity: i.quantity || 1,
                price: i.price,
            })),
            subtotal: order.subtotal,
            cgst,
            sgst,
            gstTotal: parseFloat((cgst + sgst).toFixed(2)),
            coupon: extras.couponCode || "",
            couponDiscount: extras.couponDiscount || 0,
            totalPayable: finalAmount,
            finalAmount,
            splitEnabled,
            perPersonAmount: perPerson,
            hostPaysAmount: splitEnabled ? undefined : finalAmount,
            memberCount,
            locked: false,
            billStatus: "awaiting_table_confirmation",
        }
    });
        require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ✅ MeetupMessage.create SUCCEEDED!\n`);
        return billMsg;
    } catch (err) {
        require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ MeetupMessage.create FAILED: ${err.message}\n`);
        throw err;
    }
}

// ─── PLACE ORDER ─────────────────────────────────────────────────
const placeOrder = async (req, res) => {
    try {
        const { meetupId, userId, userName, items, total, subtotal, cgst, sgst, status, cafeId, orderId, splitEnabled, perPersonAmount, members, commission, memberCount, meetupDate, meetupTime, couponCode, couponDiscount, splitType, finalAmount, postBillToChat } = req.body;
        
        // Debug logging
        require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] Incoming order: ${userName} for cafe: ${cafeId}, status: ${status}, orderId: ${orderId}\n`);

        if (!meetupId || !userId || !userName || !items || !Array.isArray(items)) {
            const missing = { meetupId: !!meetupId, userId: !!userId, userName: !!userName, items: !!items, isArray: Array.isArray(items) };
            console.error("❌ Place Order Missing Fields:", missing);
            require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ Missing Fields: ${JSON.stringify(missing)}\n`);
            return res.status(400).json({ message: "meetupId, userId, userName, and items are required" });
        }

        try {
            // Ensure meetupId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(meetupId)) {
                console.error("❌ Invalid meetupId format:", meetupId);
                require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ Invalid MeetupId: ${meetupId}\n`);
                return res.status(400).json({ message: "Invalid meetupId format" });
            }

            const meetupRow = await Meetup.findById(meetupId)
                .select("billLocked organizerId reservationFeePaid selectedCafe tableNumber members")
                .lean();

            if (meetupRow?.billLocked) {
                return res.status(403).json({
                    success: false,
                    message: "Bill is locked and cannot be changed after meetup confirmation.",
                });
            }

            let order = null;
            if (orderId) {
                order = await MeetupOrder.findOne({ orderId });
            }

            if (order) {
                if (String(order.userId) !== String(userId)) {
                    return res.status(403).json({
                        success: false,
                        message: "Only the bill creator can edit this order.",
                    });
                }
            } else if (String(meetupRow?.organizerId) !== String(userId)) {
                return res.status(403).json({
                    success: false,
                    message: "Only the meetup host can create the bill.",
                });
            }

            const cafeNameForMin =
                meetupRow?.selectedCafe?.cafeName ||
                meetupRow?.selectedCafe?.name ||
                "";
            const minOrder = getMinimumOrderForCafe(cafeNameForMin);
            const strictSubtotalCheck = items.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0,
            );
            if (strictSubtotalCheck < minOrder) {
                const need = parseFloat((minOrder - strictSubtotalCheck).toFixed(2));
                return res.status(400).json({
                    success: false,
                    message: `Minimum order for this meetup is ₹${minOrder}. Add items worth ₹${need} more to continue.`,
                    minimumOrder: minOrder,
                    currentSubtotal: strictSubtotalCheck,
                    amountNeeded: need,
                });
            }

            // --- STRICT COUPON VALIDATION ---
            let isOliveBistro = false;
            try {
                const meetupInfo = meetupRow;
                if (meetupInfo && meetupInfo.selectedCafe && 
                   (meetupInfo.selectedCafe.name === "Olive Bistro & Bar" || meetupInfo.selectedCafe.cafeName === "Olive Bistro & Bar")) {
                    isOliveBistro = true;
                }
            } catch (e) {
                console.error("Error fetching meetup for coupon validation:", e);
            }

            const strictSubtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const appliedCoupon = Math.min(couponDiscount || 0, strictSubtotal);
            const taxableBase = parseFloat((strictSubtotal - appliedCoupon).toFixed(2));
            const strictCgst = parseFloat((taxableBase * 0.025).toFixed(2));
            const strictSgst = parseFloat((taxableBase * 0.025).toFixed(2));
            const strictCommission = commission || parseFloat((strictSubtotal * 0.06).toFixed(2));
            const strictTotal = parseFloat((taxableBase + strictCgst + strictSgst).toFixed(2));

            let calculatedSubtotal = subtotal || strictSubtotal;
            let calculatedCgst = cgst || strictCgst;
            let calculatedSgst = sgst || strictSgst;
            let calculatedCommission = commission || strictCommission;
            let calculatedTotal = finalAmount || total || strictTotal;

            // 🚨 Override and strictly calculate total if Olive Bistro & Bar
            if (isOliveBistro) {
                // If they attempted to send a manipulated total (lower than strictTotal due to coupons)
                if (calculatedTotal < strictTotal) {
                     console.warn(`🚨 Blocked coupon/discount attempt for Olive Bistro & Bar! Overriding to full amount.`);
                     require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] 🚨 Coupon blocked for Olive Bistro & Bar. Overrode total from ${calculatedTotal} to ${strictTotal}.\n`);
                     calculatedSubtotal = strictSubtotal;
                     calculatedCgst = strictCgst;
                     calculatedSgst = strictSgst;
                     calculatedTotal = strictTotal;
                }
            }

            const formattedMembers = Array.isArray(members) 
                ? members.map(m => typeof m === 'string' ? { name: m, userId: userId || '' } : m)
                : [{ name: userName || 'Guest', userId: userId || '' }];

            const finalStatus = status ? status.toUpperCase() : "BILL_PENDING";
            const effectiveMemberCount =
                memberCount || meetupRow?.members?.length || 1;
            const equalPerPerson = Math.ceil(
                (calculatedTotal / effectiveMemberCount) * 100,
            ) / 100;

            if (order) {
                // 🔒 LOCK CHECK: Prevent editing if order is already locked/paid
                if (order.tokenPaid || order.status === 'ACCEPTED' || order.status === 'COMPLETED' || order.paymentStatus === 'PAID') {
                    console.warn(`🔒 Unauthorized edit attempt on locked order via placeOrder: ${orderId}`);
                    return res.status(403).json({ success: false, message: "⚠️ Order is locked and cannot be edited after payment." });
                }
                // Update existing order
                order.items = items;
                order.subtotal = calculatedSubtotal;
                order.cgst = calculatedCgst;
                order.sgst = calculatedSgst;
                order.commission = calculatedCommission;
                order.total = calculatedTotal;
                order.totalAmount = calculatedTotal;
                order.status = finalStatus;
                order.orderStatus = finalStatus;
                order.splitEnabled = splitEnabled || false;
                order.perPersonAmount = perPersonAmount || 0;
                order.memberCount = memberCount || 1;
                order.members = formattedMembers;
                order.cafeId = cafeId || order.cafeId || "";
                
                // Add meetupDate/Time
                if (meetupDate) order.meetupDate = meetupDate;
                if (meetupTime) order.meetupTime = meetupTime;
                
                await order.save();
                console.log("✅ Order updated:", order.orderId);
            } else {
                console.log("📝 Creating new order in database...");
                try {
                    order = await MeetupOrder.create({
                        meetupId: new mongoose.Types.ObjectId(meetupId),
                        userId,
                        userName: userName.trim(),
                        items,
                        subtotal: calculatedSubtotal,
                        cgst: calculatedCgst,
                        sgst: calculatedSgst,
                        commission: calculatedCommission,
                        total: calculatedTotal,
                        status: finalStatus,
                        orderStatus: finalStatus,
                        orderId: orderId || `ORD_${Date.now()}`,
                        splitEnabled: splitEnabled || false,
                        perPersonAmount: perPersonAmount || 0,
                        memberCount: memberCount || 1,
                        members: formattedMembers,
                        cafeId: cafeId || "",
                        paymentStatus: "PENDING",
                        meetupDate: meetupDate || "",
                        meetupTime: meetupTime || ""
                    });
                    require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ✅ Order saved: ${order.orderId}\n`);
                    console.log("✅ New order saved:", order.orderId, "ID:", order._id);
                } catch (createErr) {
                    require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ Create Error: ${createErr.message}\n`);
                    console.error("❌ Create Error:", createErr);
                    throw createErr;
                }
            }

            // Only emit order-created to cafe dashboard if the order has been paid
            // Draft/PLACED/PENDING orders should NOT be sent to the dashboard
            const paidStatuses = ["TOKEN_PAID", "ACCEPTED", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CASH_COLLECTED"];
            const meetupForOrder = meetupRow;

            if (paidStatuses.includes(finalStatus)) {
                const cafeRoom = cafeId || order.cafeId || "";
                if (!meetupForOrder?.reservationFeePaid) {
                    console.log(
                        `⏳ Order ${order.orderId} saved — NOT sent to cafe until ₹20 reservation fee is paid`,
                    );
                } else if (cafeRoom) {
                    // Fetch meetup info for enriched order
                    let meetupInfo = null;
                    try {
                        meetupInfo = await Meetup.findById(meetupId).select("meetupCode organizerName members selectedCafe").lean();
                    } catch (e) { /* ignore */ }

                    console.log(`📡 Emitting order-created to room: cafe_${cafeRoom} (status: ${finalStatus})`);
                    req.io.to(`cafe_${cafeRoom}`).emit("order-created", {
                        orderNumber: order.orderId ? (order.orderId.includes('_') ? order.orderId.split("_")[1].slice(-6) : order.orderId.slice(-6)) : order._id.toString().slice(-6).toUpperCase(),
                        orderId: order.orderId || order._id.toString(),
                        meetupName: meetupInfo ? `Meetup ${meetupInfo.meetupCode}` : "Meetup Order",
                        groupName: meetupInfo?.organizerName || userName || "Group",
                        meetupId: meetupId,
                        cafeId: cafeRoom,
                        memberCount: memberCount || meetupInfo?.members?.length || 1,
                        items: items.map(i => ({
                            name: i.name,
                            quantity: i.quantity || 1,
                            price: i.price || 0,
                        })),
                        totalAmount: calculatedTotal,
                        subtotal: calculatedSubtotal,
                        cgst: calculatedCgst,
                        sgst: calculatedSgst,
                        orderDate: new Date().toLocaleDateString("en-IN"),
                        orderTime: new Date().toLocaleTimeString("en-IN"),
                        status: "token_paid",
                        adminName: userName || "",
                        adminPhone: "",
                        createdAt: order.createdAt || new Date().toISOString(),
                        splitEnabled: splitEnabled || false,
                        perPersonAmount: perPersonAmount || calculatedTotal,
                        members: members || [],
                        tableNumber: meetupForOrder?.tableNumber || "",
                        reservationFeePaid: true,
                    });
                }
            } else {
                console.log(`⏳ Order ${order.orderId} NOT emitted to dashboard (status: ${finalStatus} — payment required first)`);
            }

            const draftStatuses = ["BILL_PENDING", "PENDING", "PLACED"];
            const shouldPostBill =
                postBillToChat !== false && draftStatuses.includes(finalStatus);

            require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] 🛠️ shouldPostBill evaluates to: ${shouldPostBill} (postBillToChat: ${postBillToChat}, finalStatus: ${finalStatus})\n`);

            if (shouldPostBill) {
                const splitOn = splitEnabled === true;
                const billMsg = await postOrderBillMessage(meetupId, userId, userName, order, {
                    cafeName:
                        meetupForOrder?.selectedCafe?.cafeName ||
                        meetupForOrder?.selectedCafe?.name ||
                        "",
                    couponCode: couponCode || "",
                    couponDiscount: appliedCoupon,
                    splitEnabled: splitOn,
                    perPersonAmount: splitOn
                        ? perPersonAmount || equalPerPerson
                        : calculatedTotal,
                    memberCount: effectiveMemberCount,
                });
                require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] 🛠️ About to emit receive_message...\n`);
                if (req.io) {
                    req.io.to(meetupId).emit("receive_message", billMsg);
                    require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ✅ receive_message emitted!\n`);
                } else {
                    require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ⚠️ req.io is undefined!\n`);
                }
            }

            console.log(`🍔 ${userName} ordered ₹${calculatedTotal} in meetup ${meetupId}`);

            // Create persistent notification for the user
            if (userId && mongoose.Types.ObjectId.isValid(userId)) {
                try {
                    await Notification.create({
                        userId,
                        type: "BILL",
                        message: `Your order of ₹${calculatedTotal} has been placed`,
                        orderId: order.orderId || order._id.toString(),
                        isRead: false
                    });
                } catch (notifErr) {
                    console.error("Failed to create notification:", notifErr);
                }
            }

            return res.status(200).json({ 
                success: true, 
                message: "Order processed successfully",
                order: {
                    id: order._id,
                    orderId: order.orderId,
                    status: order.status
                }
            });

        } catch (dbError) {
            console.error("❌ Database/Socket Error:", dbError);
            require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ DB/Socket Error: ${dbError.message}\n`);
            throw dbError; // Caught by outer try
        }

    } catch (error) {
        console.error("❌ Place Order Outer Error:", error);
        require("fs").appendFileSync("order_debug.log", `[${new Date().toISOString()}] ❌ Outer Error: ${error.message}\n`);
        return res.status(500).json({ message: "Internal server error in placeOrder", error: error.message });
    }
};

// ─── GET ORDERS + BILL SPLIT ─────────────────────────────────────
const getOrders = async (req, res) => {
    try {
        const { meetupId } = req.params;
        const orders = await MeetupOrder.find({ meetupId });

        const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
        const memberCount = orders[0]?.memberCount || orders.length || 1;
        const perPersonSplit = Math.ceil(grandTotal / memberCount);

        res.json({
            success: true,
            orders,
            billSummary: {
                grandTotal,
                memberCount,
                perPersonSplit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── CONFIRM BILL (Admin Only) ───────────────────────────────────
// Generates the final bill with hidden 6% platform commission
const confirmBill = async (req, res) => {
    try {
        const { meetupId, userId } = req.body;

        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        // Admin check
        if (meetup.organizerId !== userId) {
            return res.status(403).json({ message: "Only the admin can confirm the bill" });
        }

        const orders = await MeetupOrder.find({ meetupId });
        const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
        const memberCount = orders[0]?.memberCount || meetup.members.length || 1;

        // 6% platform commission — internal, NOT shown to users
        const platformCommission = grandTotal * 0.06;
        const finalAmount = grandTotal; // Users see only grandTotal

        const perPersonSplit = Math.ceil(grandTotal / memberCount);

        // Update meetup status
        meetup.status = "completed";
        await meetup.save();

        // Emit bill confirmed event
        if (req.io) {
            req.io.to(meetupId).emit("bill_confirmed", {
                meetupId,
                grandTotal,
                perPersonSplit,
                memberCount,
                orders,
            });
        }

        console.log(`💰 Bill confirmed for meetup ${meetup.meetupCode}: ₹${grandTotal} (commission: ₹${platformCommission.toFixed(2)})`);

        res.json({
            success: true,
            bill: {
                meetupId,
                grandTotal,
                perPersonSplit,
                memberCount,
                orders,
                // Commission is internal — not sent to frontend
            },
            // Internal data (for admin backend tracking only)
            _internal: {
                platformCommission,
                finalAmount: grandTotal + platformCommission,
            },
        });
    } catch (error) {
        console.error("Confirm Bill Error:", error);
        res.status(500).json({ message: "Failed to confirm bill", error: error.message });
    }
};

// ─── GET ACTIVE MEETUPS FOR A USER (DB-backed persistence) ───────
const getActiveMeetups = async (req, res) => {
    try {
        const { userId } = req.params;
        const meetups = await Meetup.find({
            "members.userId": userId,
            status: { $in: ["active", "voting", "ordering", "completed"] },
        }).sort({ createdAt: -1 });

        res.json({ success: true, meetups });
    } catch (error) {
        console.error("Get Active Meetups Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ─── GET MY MEETUPS (Shows only meetups the user has joined) ───────
const getMyMeetups = async (req, res) => {
    try {
        const userId = req.query.userId || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const meetups = await Meetup.find({
            "members.userId": userId,
            status: { $in: ["active", "voting", "ordering", "completed"] },
        }).sort({ createdAt: -1 });

        res.json({ success: true, meetups });
    } catch (error) {
        console.error("Get My Meetups Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/** GET /api/meetups/hosted/:userId — Meetups created by user (organizerId) */
const getHostedMeetups = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const meetups = await Meetup.find({
            $or: [{ organizerId: userId }, { organizerId: String(userId) }],
        })
            .sort({ createdAt: -1 })
            .lean();

        const enriched = meetups.map((m) => ({
            ...m,
            memberCount: m.members?.length ?? 0,
            meetupName: m.title,
            cafeName: extractCafeName(m.selectedCafe),
        }));

        res.json({
            success: true,
            meetups: enriched,
            count: enriched.length,
        });
    } catch (error) {
        console.error("Get Hosted Meetups Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

function extractCafeName(selectedCafe) {
    if (!selectedCafe) return null;
    if (typeof selectedCafe === "string") return selectedCafe;
    return selectedCafe.cafeName || selectedCafe.name || null;
}

/** POST /api/meetups/end — Host ends an active meetup */
const endMeetup = async (req, res) => {
    try {
        const { meetupId, userId } = req.body;
        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const meetup = await Meetup.findById(meetupId);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }

        if (meetup.organizerId !== userId) {
            return res.status(403).json({ message: "Only the host can end this meetup" });
        }

        if (meetup.status === "completed") {
            return res.json({ success: true, message: "Meetup already ended", meetup });
        }

        meetup.status = "completed";
        await meetup.save();

        console.log(`🏁 Meetup ended: ${meetup.meetupCode} by host ${userId}`);

        res.json({ success: true, message: "Meetup ended", meetup });
    } catch (error) {
        console.error("End Meetup Error:", error);
        res.status(500).json({ message: "Failed to end meetup", error: error.message });
    }
};

// ─── RAZORPAY: CREATE 20 PKR/INR TOKEN ORDER ─────────────────────
const createRazorpayOrder = async (req, res) => {
    try {
        console.log("API HIT ✅", req.body);
        const { meetupId, userId } = req.body;

        if (!meetupId || !userId) {
            return res.status(400).json({ message: "meetupId and userId are required" });
        }

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_STzO1DnRlqY3vN',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '9sLZEDjBN9jEmraAsRC8fmOL',
        });

        // 20 INR token amount in paise
        const options = {
            amount: 2000, 
            currency: "INR",
            receipt: `receipt_${meetupId}_${Date.now()}`.substring(0, 40),
            notes: {
                platform: "Caffelino",
                purpose: "Table Confirmation"
            }
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: error.message });
    }
};

// ─── RAZORPAY: VERIFY PAYMENT ────────────────────────────────────
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, meetupId, userId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment details missing" });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || '9sLZEDjBN9jEmraAsRC8fmOL';
        const generated_signature = crypto.createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // Emit socket event saying payment token is received if meetup is provided
        if (meetupId && req.io) {
            
            // Mark orders as confirmed in DB
            const orders = await MeetupOrder.find({ meetupId });
            for (let o of orders) {
                o.status = "CONFIRMED";
                await o.save();
            }

            const meetup = await Meetup.findById(meetupId);
            if (meetup) {
                meetup.reservationFeePaid = true;
                meetup.reservationFeeAmount = 20;
                meetup.billLocked = true;
                if (!meetup.tableNumber) {
                    meetup.tableNumber = `T-${Math.floor(Math.random() * 12) + 1}`;
                }
                meetup.status = "confirmed";
                await meetup.save();
                
                // Get totals to share with users
                const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
                const memberCount = orders[0]?.memberCount || meetup.members.length || 1;
                const perPersonSplit = Math.ceil(grandTotal / memberCount);

                req.io.to(meetupId).emit("bill_confirmed", {
                    meetupId,
                    grandTotal,
                    perPersonSplit,
                    memberCount,
                    orders,
                    isTokenPayment: true
                });
            }
        }

        // Notification for User
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            await Notification.create({
                userId,
                type: "BILL",
                message: "Your meetup token/order is confirmed",
                isRead: false
            });
        }

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: "Payment verification error", error: error.message });
    }
};

module.exports = {
    createMeetup,
    joinMeetup,
    getMeetupById,
    getMeetupByCode,
    getUserMeetups,
    getAllMeetups,
    countMeetups,
    sendMessage,
    leaveMeetup,
    getMessages,
    addCafesForVoting,
    voteCafe,
    endVoting,
    getCafeMenu,
    selectCafe,
    placeOrder,
    getOrders,
    confirmBill,
    applyCoupon,
    getActiveMeetups,
    getMyMeetups,
    getHostedMeetups,
    endMeetup,
    createRazorpayOrder,
    verifyRazorpayPayment,
    confirmTableReservation,
};
