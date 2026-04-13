const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Cafe/Cafe_orders");
const CafeMenu = require("../models/Cafe/cafe_menu");

// ─── Place Order (with MongoDB Transaction) ─────────────────────
// POST /api/user/order
const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, cafeId, items } = req.body;

        // Validate items and calculate total from DB prices (prevents price manipulation)
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            // Validate each item: must exist, belong to the cafe, and be available
            const menuItem = await CafeMenu.findOne({
                _id: item.menuItem,
                cafe_owner: cafeId,
                available: true,
            }).session(session);

            if (!menuItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: `Menu item not found or unavailable: ${item.menuItem}`,
                });
            }

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price, // Price from DB, not from client
            });

            totalAmount += menuItem.price * item.quantity;
        }

        // Create the order within the transaction
        const order = await Order.create(
            [
                {
                    cafe: cafeId,
                    user: userId,
                    items: orderItems,
                    totalAmount,
                    orderStatus: "PLACED",
                    paymentStatus: "PENDING",
                },
            ],
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Notification for User (Outside transaction is fine since order succeeded)
        const Notification = require("../models/User/Notification");
        await Notification.create({
            userId,
            type: "BILL",
            message: `Your order of ₹${totalAmount} is confirmed`,
            orderId: order[0]._id,
            isRead: false
        });

        res.status(201).json({
            message: "Order placed successfully",
            order: order[0],
        });
    } catch (error) {
        // Abort on any error
        await session.abortTransaction();
        session.endSession();
        console.error("Place Order Error:", error);
        res.status(500).json({ message: "Server error during order placement" });
    }
};

// ─── Get User's Order History ────────────────────────────────────
// GET /api/user/myorders
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ user: userId })
            .populate("cafe", "Name Cafe_Address")
            .populate("items.menuItem", "item_name price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const { updateProfile } = require("../controllers/user.controller");

const Coupon = require("../models/Coupon");

// ─── Route Definitions ──────────────────────────────────────────
router.post("/orders", placeOrder);
router.get("/myorders/:userId", getUserOrders);
router.put("/profile/:userId", updateProfile);

router.post("/apply-coupon", async (req, res) => {
  try {
    const { code, email, orderAmount, cafeName } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    if (cafeName !== coupon.cafe) {
      return res.status(400).json({ message: "Coupon not valid for this cafe" });
    }

    if (orderAmount < coupon.minOrder) {
      return res.status(400).json({ message: "Minimum order value ₹700 required" });
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Offer expired" });
    }

    const alreadyUsed = coupon.usersUsed.some(u => u.email === email);
    if (alreadyUsed) {
      return res.status(400).json({ message: "Coupon already used with this email" });
    }

    // 🔒 ATOMIC UPDATE (IMPORTANT)
    const updated = await Coupon.findOneAndUpdate(
      {
        code,
        isActive: true,
        usedCount: { $lt: coupon.maxUsage },
        "usersUsed.email": { $ne: email }
      },
      {
        $inc: { usedCount: 1 },
        $push: {
          usersUsed: { email, orderAmount }
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: "Offer expired" });
    }

    if (updated.usedCount >= updated.maxUsage) {
      updated.isActive = false;
      await updated.save();
    }

    return res.json({
      success: true,
      discount: updated.discount,
      finalAmount: orderAmount - updated.discount
    });

  } catch (err) {
    console.error("Apply Coupon Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
