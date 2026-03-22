const express = require("express");
const router = express.Router();
const authCafe = require("../middlewares/authCafe");
const cafeApproved = require("../middlewares/cafeApproved");
const cafeExists = require("../middlewares/cafeExists");
const upload = require("../middlewares/upload");

const {
    registerCafe,
    Logincafe,
    updateCafe,
    deleteCafe,
    getCafeById,
    MenuItem,
    EditMenuItem,
    toggleMenuAvailability,
    deleteItem,
    getItems,
    getItemById,
    approveCafe,
    getCafeOrders,
    updateOrderStatus,
    collectPayment,
    getCafeTotalAmount,
    registerCafeSimple,
    getMyCafe,
    verifyCafe,
    getApprovedCafes,
    testDump,
    updateCafePhotos,
    getMeetupOrders,
    getPublicMenu,
} = require("../controllers/cafe.controller");

// ─── Simplified Routes (Google-authenticated users) ──────────
router.get("/test-menus", testDump);

// POST /api/cafe/register-simple — Register cafe with minimal info (no files)
router.post("/register-simple", registerCafeSimple);

// GET /api/cafe/my-cafe/:ownerId — Get cafe for a specific owner
router.get("/my-cafe/:ownerId", getMyCafe);

// PATCH /api/cafe/verify/:id — Verify/approve a cafe
router.patch("/verify/:id", verifyCafe);

// GET /api/cafe/approved — Get all approved cafes (public, for user-facing page)
router.get("/approved", getApprovedCafes);

// PATCH /api/cafe/update-photos/:cafeId — Update cafe photos from dashboard
router.patch("/update-photos/:cafeId", updateCafePhotos);

// GET /api/cafe/meetup-orders/:cafeId — Get meetup orders for a cafe (public)
router.get("/meetup-orders/:cafeId", getMeetupOrders);

// ─── Authentication & Profile ────────────────────────────────────

// POST /api/cafe/register — Register with photos
router.post(
    "/register",
    upload.fields([
        { name: "Cafe_photos", maxCount: 5 },
        { name: "upi_photo", maxCount: 1 },
    ]),
    registerCafe
);

// POST /api/cafe/login — Login
router.post("/login", Logincafe);

// PUT /api/cafe/editprofile — Update profile (auth + approved)
router.put("/editprofile", authCafe, cafeApproved, updateCafe);

// GET /api/cafe/cafedetail — Get own details (auth + approved)
router.get("/cafedetail", authCafe, cafeApproved, getCafeById);

// DELETE /api/cafe/delete/cafe — Delete account (auth + approved)
router.delete("/delete/cafe", authCafe, cafeApproved, deleteCafe);

// PATCH /api/cafe/approve/:id — Admin approval
router.patch("/approve/:id", approveCafe);

// ─── Menu Management (auth + cafeExists required) ─────────────────

// POST /api/cafe/menuItem/cafe — Add a new menu item
router.post("/menuItem/cafe", authCafe, cafeExists, upload.fields([{ name: "image", maxCount: 1 }]), MenuItem);

// PUT /api/cafe/menuItem/edit/:id — Edit a menu item
router.put("/menuItem/edit/:id", authCafe, cafeExists, upload.fields([{ name: "image", maxCount: 1 }]), EditMenuItem);

// PATCH /api/cafe/menuItem/availability/:id — Toggle availability
router.patch(
    "/menuItem/availability/:id",
    authCafe,
    cafeExists,
    toggleMenuAvailability
);

// ─── Menu Management ──────────────────────────────────────────
// GET /api/cafe/public/menu/:cafeId — Public menu access
router.get("/public/menu/:cafeId", getPublicMenu);

// DELETE /api/cafe/delete/item/:itemid — Delete a menu item
router.delete("/delete/item/:itemid", authCafe, cafeExists, deleteItem);

// GET /api/cafe/cafe/items — Get all menu items
router.get("/cafe/items", authCafe, cafeExists, getItems);

// GET /api/cafe/cafe/:menuId — Get single menu item by ID
router.get("/cafe/:menuId", authCafe, cafeExists, getItemById);

// ─── Orders & Payments (auth + approved required) ───────────────

// GET /api/cafe/orders/cafe — Get all orders
router.get("/orders/cafe", authCafe, cafeApproved, getCafeOrders);

// PATCH /api/cafe/cafe/orders/status — Update order status
router.patch("/cafe/orders/status", cafeApproved, authCafe, updateOrderStatus);

// POST /api/cafe/orders/:orderId/collect-payment — Collect payment
router.post(
    "/orders/:orderId/collect-payment",
    cafeApproved,
    authCafe,
    collectPayment
);

// GET /api/cafe/orders/cafe/total — Total earnings (aggregation)
router.get("/orders/cafe/total", cafeApproved, authCafe, getCafeTotalAmount);

// ─── Dashboard ───────────────────────────────────────────────────

// GET /api/cafe/dashboard — Welcome message
router.get("/dashboard", authCafe, cafeApproved, (req, res) => {
    res.json({ message: "Welcome to cafe dashboard" });
});

module.exports = router;
