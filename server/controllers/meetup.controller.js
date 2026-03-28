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
        const { title, organizerId, organizerName, date, time } = req.body;

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
            organizerId,
            organizerName,
            date: date || "",
            time: time || "",
            members: [
                {
                    userId: organizerId,
                    name: organizerName,
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
        const { meetupCode, userId, name } = req.body;

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
        meetup.members.push({ userId, name, joinedAt: new Date() });
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
            // Optionally clean up orders and messages associated with this meetup
            await MeetupMessage.deleteMany({ meetupId });
            await MeetupOrder.deleteMany({ meetupId });
            
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
        const { meetupId, userId, userName, message, type, billData, paymentData } = req.body;

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

// ─── VALID COUPONS (static map) ──────────────────────────────────
const VALID_COUPONS = {
    'WELCOME50': 50,
    'FLAT100': 100,
    'CAFE20': 20,
    'MEETUP75': 75,
    'FIRST25': 25,
};

// ─── APPLY COUPON ────────────────────────────────────────────────
const applyCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const upperCode = code.trim().toUpperCase();
        const discount = VALID_COUPONS[upperCode];

        if (discount === undefined) {
            return res.status(400).json({ success: false, message: "Invalid coupon code" });
        }

        // Cap discount at the subtotal
        const actualDiscount = Math.min(discount, subtotal || Infinity);

        console.log(`🎫 Coupon ${upperCode} validated: ₹${actualDiscount} off`);

        res.json({
            success: true,
            code: upperCode,
            discount: actualDiscount,
            message: `Coupon applied! ₹${actualDiscount} off`,
        });
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ message: "Failed to apply coupon", error: error.message });
    }
};

// ─── PLACE ORDER ─────────────────────────────────────────────────
const placeOrder = async (req, res) => {
    try {
        const { meetupId, userId, userName, items, total, subtotal, cgst, sgst, status, cafeId, orderId, splitEnabled, perPersonAmount, members, commission } = req.body;
        
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

            const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const calculatedCgst = cgst || parseFloat((calculatedSubtotal * 0.025).toFixed(2));
            const calculatedSgst = sgst || parseFloat((calculatedSubtotal * 0.025).toFixed(2));
            const calculatedCommission = commission || parseFloat((calculatedSubtotal * 0.06).toFixed(2));
            const calculatedTotal = total || parseFloat((calculatedSubtotal + calculatedCgst + calculatedSgst).toFixed(2));

            const formattedMembers = Array.isArray(members) 
                ? members.map(m => typeof m === 'string' ? { name: m, userId: userId || '' } : m)
                : [{ name: userName || 'Guest', userId: userId || '' }];

            let order = null;
            if (orderId) {
                order = await MeetupOrder.findOne({ orderId });
            }

            const finalStatus = status ? status.toUpperCase() : "PENDING";

            if (order) {
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
                order.members = formattedMembers;
                order.cafeId = cafeId || order.cafeId || "";
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
                        members: formattedMembers,
                        cafeId: cafeId || "",
                        paymentStatus: "PENDING"
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
            if (paidStatuses.includes(finalStatus)) {
                const cafeRoom = cafeId || order.cafeId || "";
                if (cafeRoom) {
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
                        memberCount: meetupInfo?.members?.length || 1,
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
                    });
                }
            } else {
                console.log(`⏳ Order ${order.orderId} NOT emitted to dashboard (status: ${finalStatus} — payment required first)`);
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
        const memberCount = orders.length || 1;
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
        const memberCount = meetup.members.length || 1;

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
            receipt: `receipt_${meetupId}_${Date.now()}`.substring(0, 40)
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

            // Also mark meetup as completed or at least advance it
            const meetup = await Meetup.findById(meetupId);
            if (meetup) {
                meetup.status = "completed";
                await meetup.save();
                
                // Get totals to share with users
                const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);
                const memberCount = meetup.members.length || 1;
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
    createRazorpayOrder,
    verifyRazorpayPayment,
};
