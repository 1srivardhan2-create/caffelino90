const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Cafe = require("../models/Cafe/Cafe_login");
const CafeMenu = require("../models/Cafe/cafe_menu");
const Order = require("../models/Cafe/Cafe_orders");
const Cafeearnings = require("../models/Cafe/Cafe_earning");
const CashCollection = require("../models/Cafe/Collection_cafe");
const uploadBuffer = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();

// Helper: upload a base64 data URI string directly to Cloudinary
async function uploadBase64ToCloudinary(base64String, folder) {
    if (!base64String || typeof base64String !== 'string') {
        console.warn('[uploadBase64] Skipped: no valid string provided');
        return '';
    }
    // If it's already a URL (http/https), return as-is
    if (base64String.startsWith('http://') || base64String.startsWith('https://')) return base64String;
    // Only process data: URIs
    if (!base64String.startsWith('data:')) {
        console.warn('[uploadBase64] Skipped: string does not start with data: or http');
        return '';
    }
    try {
        console.log(`[uploadBase64] Uploading to Cloudinary folder: ${folder}, data length: ${base64String.length}`);
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: 'image',
        });
        console.log(`[uploadBase64] SUCCESS: ${result.secure_url}`);
        return result.secure_url;
    } catch (err) {
        console.error(`[uploadBase64] FAILED for folder ${folder}:`, err.message);
        console.error('[uploadBase64] Check CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
        return '';
    }
}

// ═══════════════════════════════════════════════════════════════
//  AUTH — Register & Login
// ═══════════════════════════════════════════════════════════════

// Register a new cafe with photos, UPI QR, and credentials
const registerCafe = async (req, res) => {
    try {
        const {
            Name, Cafe_Address, cafe_location, Cafe_type, Average_Cost, AboutCafe,
            managerName, Phonenumber, designation, AlternateContact,
            email_address_manager, password, opening_hours, paymentMethods, upiIDs,
        } = req.body;

        // Validate required fields
        if (!Name || !Cafe_Address || !cafe_location || !managerName ||
            !Phonenumber || !email_address_manager || !password) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Check for duplicate email
        const existingCafe = await Cafe.findOne({ email_address_manager });
        if (existingCafe) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Validate minimum photos
        if (!req.files || !req.files.Cafe_photos || req.files.Cafe_photos.length < 5) {
            return res.status(400).json({ message: "Minimum 5 cafe photos required" });
        }

        if (!req.files.upi_photo || !req.files.upi_photo[0]) {
            return res.status(400).json({ message: "UPI photo is required" });
        }

        // Upload cafe photos to Cloudinary
        let Cafe_photos = [];
        for (const file of req.files.Cafe_photos) {
            const url = await uploadBuffer(file.buffer, "cafes/photos");
            Cafe_photos.push(url);
        }

        // Upload UPI QR photo
        const upi_photo = await uploadBuffer(
            req.files.upi_photo[0].buffer,
            "cafes/upi"
        );

        // Hash password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Parse JSON fields if sent as strings
        const parsedCafeType = typeof Cafe_type === "string" ? JSON.parse(Cafe_type) : Cafe_type;
        const parsedPaymentMethods = typeof paymentMethods === "string" ? JSON.parse(paymentMethods) : paymentMethods;
        const parsedUpiIDs = typeof upiIDs === "string" ? JSON.parse(upiIDs) : upiIDs;
        const parsedOpeningHours = typeof opening_hours === "string" ? JSON.parse(opening_hours) : opening_hours;

        // Create new cafe (status: false — awaiting admin approval)
        const newCafe = await Cafe.create({
            Name,
            Cafe_Address,
            cafe_location,
            Cafe_type: parsedCafeType,
            Average_Cost,
            AboutCafe,
            managerName,
            Phonenumber,
            designation,
            AlternateContact,
            email_address_manager,
            password: hashedPassword,
            status: false,
            opening_hours: parsedOpeningHours,
            paymentMethods: parsedPaymentMethods,
            upiIDs: parsedUpiIDs,
            upi_photo,
            Cafe_photos,
            profilePicture: req.body.profilePicture || "", // Handle profilePicture if sent in body
        });

        // Sign JWT with cafe ID
        const token = jwt.sign(
            { id: newCafe._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        // Set httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        res.status(201).json({
            message: "Cafe registered successfully. Awaiting admin approval.",
            cafe: {
                id: newCafe._id,
                Name: newCafe.Name,
                email_address_manager: newCafe.email_address_manager,
                status: newCafe.status,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Authenticate cafe owner and return JWT
const Logincafe = async (req, res) => {
    try {
        const { Name, email_address_manager, password } = req.body;

        if (!email_address_manager || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find cafe by name + email
        const query = { email_address_manager };
        if (Name) query.Name = Name;
        const cafe = await Cafe.findOne(query);

        if (!cafe) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if cafe is approved
        if (!cafe.status) {
            return res.status(403).json({ message: "Cafe not approved by admin yet" });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, cafe.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: cafe._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        // Set httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
        });

        // Return cafe data (without password)
        const { password: _, ...safeCafe } = cafe.toObject();
        res.json({ message: "Login successful", cafe: safeCafe, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  PROFILE — Update, Delete, Get
// ═══════════════════════════════════════════════════════════════

// Update cafe profile (name, address, photos, etc.)
const updateCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findById(req.cafe.id);
        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        // Handle profilePicture: upload base64 to Cloudinary
        if (req.body.profilePicture && typeof req.body.profilePicture === 'string' && req.body.profilePicture.startsWith('data:')) {
            const url = await uploadBase64ToCloudinary(req.body.profilePicture, 'cafes/profiles');
            if (url) req.body.profilePicture = url;
        }
        // Also handle profilePhoto (frontend may send it under this name)
        if (req.body.profilePhoto && typeof req.body.profilePhoto === 'string' && req.body.profilePhoto.startsWith('data:')) {
            const url = await uploadBase64ToCloudinary(req.body.profilePhoto, 'cafes/profiles');
            if (url) req.body.profilePicture = url;
            delete req.body.profilePhoto;
        }

        // Handle cafePhotos / Cafe_photos sent as base64 array in body
        const bodyPhotos = req.body.cafePhotos || req.body.Cafe_photos;
        if (Array.isArray(bodyPhotos) && bodyPhotos.length > 0) {
            const uploadedPhotos = [];
            for (const photo of bodyPhotos) {
                if (typeof photo === 'string' && photo.startsWith('data:')) {
                    const url = await uploadBase64ToCloudinary(photo, 'cafes/photos');
                    if (url) uploadedPhotos.push(url);
                } else if (typeof photo === 'string' && photo.startsWith('http')) {
                    uploadedPhotos.push(photo);
                }
            }
            if (uploadedPhotos.length > 0) {
                req.body.Cafe_photos = uploadedPhotos;
            }
            delete req.body.cafePhotos; // Normalize to Cafe_photos
        }

        // Merge new data into existing cafe
        Object.assign(cafe, req.body);

        // Re-hash password if it was changed
        if (req.body.password) {
            cafe.password = await bcrypt.hash(req.body.password, 10);
        }

        // Re-upload photos if provided via multipart file upload
        if (req.files && req.files.Cafe_photos) {
            let Cafe_photos = [];
            for (const file of req.files.Cafe_photos) {
                const url = await uploadBuffer(file.buffer, "cafes/photos");
                Cafe_photos.push(url);
            }
            cafe.Cafe_photos = Cafe_photos;
        }

        if (req.files && req.files.upi_photo && req.files.upi_photo[0]) {
            cafe.upi_photo = await uploadBuffer(
                req.files.upi_photo[0].buffer,
                "cafes/upi"
            );
        }

        await cafe.save();

        // Strip password before sending response
        const { password, ...safeCafe } = cafe.toObject();
        res.json({ message: "Cafe updated successfully", cafe: safeCafe });
    } catch (error) {
        console.error("Update Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete cafe account and clear auth cookie
const deleteCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findByIdAndDelete(req.cafe.id);
        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        // Also delete all menu items for this cafe
        await CafeMenu.deleteMany({ cafe_owner: req.cafe.id });

        // Clear the auth cookie
        res.clearCookie("token");
        res.json({ message: "Cafe deleted successfully" });
    } catch (error) {
        console.error("Delete Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get the logged-in cafe's own details
const getCafeById = async (req, res) => {
    try {
        const cafe = await Cafe.findById(req.cafe.id).select("-password");
        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }
        res.json(cafe);
    } catch (error) {
        console.error("Get Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  MENU — CRUD Operations
// ═══════════════════════════════════════════════════════════════

// Add a new menu item
const MenuItem = async (req, res) => {
    try {
        const { item_name, description_food, price, food_type, popular, Category, image_url } = req.body;

        // Determine the actual cafe ID, prioritizing x-cafe-id header for flexibility
        let actualCafeId = req.headers['x-cafe-id'] || req.cafe.id;
        try {
            // If the ID from header/token doesn't directly match a cafe _id,
            // check if it's an ownerId and find the associated cafe _id.
            const cafeCheck = await Cafe.findById(actualCafeId);
            if (!cafeCheck) {
                const cafeByOwner = await Cafe.findOne({ ownerId: actualCafeId });
                if (cafeByOwner) actualCafeId = cafeByOwner._id.toString();
            }
        } catch (e) { /* ignore */ } // Ignore if actualCafeId is not a valid ObjectId

        if (!item_name || !price || !Category || !food_type) {
            return res.status(400).json({
                message: "Item name, category, food type, and price are required",
            });
        }

        let finalImageUrl = "";
        // Handle image upload from multipart form data (req.files)
        if (req.files && req.files.image && req.files.image[0] && req.files.image[0].buffer) {
            finalImageUrl = await uploadBuffer(req.files.image[0].buffer, "cafes/menu");
        }
        // Handle image upload from base64 string in body
        else if (image_url && typeof image_url === 'string') {
            if (image_url.startsWith('data:')) {
                finalImageUrl = await uploadBase64ToCloudinary(image_url, 'cafes/menu');
            }
            // Preserve existing http/https URLs
            else if (image_url.startsWith('http')) {
                finalImageUrl = image_url;
            }
        }

        const menuItem = await CafeMenu.create({
            cafe_owner: actualCafeId,
            item_name,
            Category,
            food_type,
            price: Number(price),
            description_food: description_food || "",
            image_url: finalImageUrl,
            popular: popular || false, // Default to false if not provided
        });

        res.status(201).json({ message: "Menu item added", menuItem });
    } catch (error) {
        console.error("Add Menu Error:", error);
        res.status(500).json({ message: "Failed to add menu item: " + error.message });
    }
};

// Edit an existing menu item (ownership check)
const EditMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const cafeId = req.cafe.id;

        // Ownership check — cafe can only edit its own items
        const menuItem = await CafeMenu.findOne({ _id: id, cafe_owner: cafeId });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        // Update only provided fields
        if (req.body.item_name) menuItem.item_name = req.body.item_name;
        if (req.body.Category) menuItem.Category = req.body.Category;
        if (req.body.food_type) menuItem.food_type = req.body.food_type;
        if (req.body.price) menuItem.price = Number(req.body.price);
        if (req.body.description_food !== undefined)
            menuItem.description_food = req.body.description_food;
        if (req.body.image_url !== undefined)
            menuItem.image_url = req.body.image_url;

        // Upload file to Cloudinary
        if (req.files && req.files.image && req.files.image[0] && req.files.image[0].buffer) {
            menuItem.image_url = await uploadBuffer(req.files.image[0].buffer, "cafes/menu");
        } else if (req.body.image_url && typeof req.body.image_url === 'string' && req.body.image_url.startsWith('data:')) {
            menuItem.image_url = await uploadBase64ToCloudinary(req.body.image_url, 'cafes/menu');
        }

        await menuItem.save();
        res.json({ message: "Menu item updated", menuItem });
    } catch (error) {
        console.error("Edit Menu Error:", error);
        res.status(500).json({ message: "Failed to edit menu item: " + error.message });
    }
};

// Toggle a menu item's availability (on/off)
const toggleMenuAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const menuItem = await CafeMenu.findOne({ _id: id, cafe_owner: req.cafe.id });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        // Flip the boolean
        menuItem.available = !menuItem.available;
        await menuItem.save();

        res.json({
            message: `Menu item ${menuItem.available ? "enabled" : "disabled"}`,
            menuItem,
        });
    } catch (error) {
        console.error("Toggle Availability Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a menu item
const deleteItem = async (req, res) => {
    try {
        const { itemid } = req.params;

        const item = await CafeMenu.findOneAndDelete({
            _id: itemid,
            cafe_owner: req.cafe.id,
        });

        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.json({ message: "Menu item deleted" });
    } catch (error) {
        console.error("Delete Item Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all menu items for the logged-in cafe
const getItems = async (req, res) => {
    try {
        let actualCafeId = req.headers['x-cafe-id'] || req.cafe.id;
        try {
            const cafeCheck = await Cafe.findById(actualCafeId);
            if (!cafeCheck) {
                const cafeByOwner = await Cafe.findOne({ ownerId: actualCafeId });
                if (cafeByOwner) actualCafeId = cafeByOwner._id.toString();
            }
        } catch (e) { /* ignore */ }

        const items = await CafeMenu.find({ cafe_owner: actualCafeId });
        res.json(items);
    } catch (error) {
        console.error("Get Items Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single menu item by ID
const getItemById = async (req, res) => {
    try {
        const { menuId } = req.params;
        const item = await CafeMenu.findOne({ _id: menuId, cafe_owner: req.cafe.id });
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.json(item);
    } catch (error) {
        console.error("Get Item Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  ADMIN — Approve Cafe (duplicate for convenience)
// ═══════════════════════════════════════════════════════════════

const approveCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findByIdAndUpdate(
            req.params.id,
            { status: true },
            { new: true }
        );

        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        res.json({ message: "Cafe approved successfully" });
    } catch (error) {
        console.error("Approve Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  ORDERS — View & Update Status
// ═══════════════════════════════════════════════════════════════

// Get all orders for the logged-in cafe (with populated user + item details)
const getCafeOrders = async (req, res) => {
    try {
        // Only return orders that have been paid (exclude PLACED/draft orders)
        const orders = await Order.find({
            cafe: req.cafe.id,
            orderStatus: { $in: ["ACCEPTED", "PREPARING", "READY", "COMPLETED", "CASH_COLLECTED"] }
        })
            .sort({ createdAt: -1 })
            .populate("user", "name phone")
            .populate("items.menuItem", "item_name");

        res.json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update order status (PLACED → ACCEPTED → PREPARING → READY → COMPLETED)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = [
            "PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED", "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        const order = await Order.findOneAndUpdate(
            { _id: orderId, cafe: req.cafe.id },
            { orderStatus: status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  PAYMENTS — Collect & View Earnings
// ═══════════════════════════════════════════════════════════════

// Mark an order as paid and create a collection entry
const collectPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { method, amount } = req.body;

        const validMethods = ["CASH", "UPI", "CARD"];
        if (!validMethods.includes(method)) {
            return res.status(400).json({
                message: `Invalid method. Must be one of: ${validMethods.join(", ")}`,
            });
        }

        // Find the order
        const order = await Order.findOne({
            _id: orderId,
            cafe: req.cafe.id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({ message: "Payment already collected" });
        }

        // Determine collection amount and status
        const collectionAmount = amount || order.totalAmount;
        const collectionStatus =
            collectionAmount < order.totalAmount ? "PARTIAL" : "COLLECTED";

        // Update order payment status
        order.paymentStatus = "PAID";
        order.paymentMethod = method;
        order.orderStatus = "COMPLETED";
        await order.save();

        // Update earnings summary document (increment counters)
        await Cafeearnings.findOneAndUpdate(
            { cafe: req.cafe.id },
            {
                $inc: {
                    total: collectionAmount,
                    cashCollected: method === "CASH" ? collectionAmount : 0,
                    totalOrders: 1,
                    cashCollectionCount: method === "CASH" ? 1 : 0,
                },
            },
            { upsert: true, new: true }
        );

        // Create collection record (audit trail)
        await CashCollection.create({
            order: order._id,
            expectedAmount: order.totalAmount,
            collectedAmount: collectionAmount,
            status: collectionStatus,
            Mode: method,
            cafe: req.cafe.id,
        });

        res.json({ message: "Payment collected successfully", order });
    } catch (error) {
        console.error("Collect Payment Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get total earnings from the summary document
const getCafeTotalAmount = async (req, res) => {
    try {
        // Read from the pre-computed summary document (fast)
        const earnings = await Cafeearnings.findOne({ cafe: req.cafe.id });

        // Get recent collection records for detail view
        const recentCollections = await CashCollection.find({ cafe: req.cafe.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("order");

        res.json({
            totalAmount: earnings ? earnings.total : 0,
            cashCollected: earnings ? earnings.cashCollected : 0,
            totalOrders: earnings ? earnings.totalOrders : 0,
            cashCollectionCount: earnings ? earnings.cashCollectionCount : 0,
            recentCollections,
        });
    } catch (error) {
        console.error("Get Total Amount Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ═══════════════════════════════════════════════════════════════
//  SIMPLIFIED REGISTRATION (for Google-authenticated users)
// ═══════════════════════════════════════════════════════════════

// Register a cafe with minimal info (no file uploads required)
const registerCafeSimple = async (req, res) => {
    try {
        const { ownerId, cafeName, location, tables, email, managerName, phone, opening_hours, establishmentType, latitude, longitude, profilePicture, averageCostPerPerson, description, cafePhotos } = req.body;

        if (!ownerId || !cafeName || !establishmentType) {
            return res.status(400).json({ message: "Owner ID, Cafe Name, and Establishment Type are required" });
        }

        // Check if this owner already has a cafe
        const existingCafe = await Cafe.findOne({ ownerId });
        if (existingCafe) {
            return res.status(400).json({
                message: "You already have a registered cafe",
                cafe: existingCafe
            });
        }

        // Check if email is already used by another cafe — if so, delete the stale one
        if (email) {
            const emailCafe = await Cafe.findOne({ email_address_manager: email });
            if (emailCafe) {
                // If it belongs to a different owner, remove the old entry (stale test data)
                if (emailCafe.ownerId !== ownerId) {
                    console.log("🗑️ Removing stale cafe with same email:", emailCafe._id);
                    await Cafe.deleteOne({ _id: emailCafe._id });
                }
            }
        }

        // Upload profilePicture to Cloudinary if it's base64
        let finalProfilePicture = '';
        if (profilePicture && typeof profilePicture === 'string' && profilePicture.startsWith('data:')) {
            finalProfilePicture = await uploadBase64ToCloudinary(profilePicture, 'cafes/profiles');
        } else if (profilePicture && typeof profilePicture === 'string' && profilePicture.startsWith('http')) {
            finalProfilePicture = profilePicture;
        }

        // Upload cafePhotos to Cloudinary if they are base64
        let finalCafePhotos = [];
        if (Array.isArray(cafePhotos)) {
            for (const photo of cafePhotos) {
                if (typeof photo === 'string' && photo.startsWith('data:')) {
                    const url = await uploadBase64ToCloudinary(photo, 'cafes/photos');
                    if (url) finalCafePhotos.push(url);
                } else if (typeof photo === 'string' && photo.startsWith('http')) {
                    finalCafePhotos.push(photo);
                }
            }
        }

        const newCafe = await Cafe.create({
            ownerId,
            Name: cafeName,
            Cafe_Address: location || "",
            cafe_location: location || "",
            latitude: latitude || 0,
            longitude: longitude || 0,
            establishmentType: establishmentType,
            tables: tables || 0,
            email_address_manager: email || "",
            managerName: managerName || "",
            Phonenumber: phone || "",
            status: false, // pending admin approval
            opening_hours: opening_hours || {},
            profilePicture: finalProfilePicture,
            Average_Cost: averageCostPerPerson || "",
            AboutCafe: description || "",
            Cafe_photos: finalCafePhotos,
        });

        console.log("☕ New cafe registered:", { id: newCafe._id, name: cafeName, ownerId });

        res.status(201).json({
            success: true,
            message: "Cafe registered successfully. Awaiting admin approval.",
            cafe: {
                id: newCafe._id,
                ownerId: newCafe.ownerId,
                cafeName: newCafe.Name,
                location: newCafe.cafe_location,
                tables: newCafe.tables,
                status: newCafe.status,
            },
        });
    } catch (error) {
        console.error("Simple Registration Error:", error);

        // Handle duplicate key error gracefully
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'unknown field';
            return res.status(400).json({
                message: `A cafe with this ${field} already exists. Please use a different value or contact support.`,
                error: error.message,
            });
        }

        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// Get cafe for a specific owner (used after Google login)
const getMyCafe = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { email } = req.query;

        let queryOr = [{ ownerId: ownerId }];
        
        // If ownerId is a valid MongoDB ObjectId, it might actually be the cafe's _id 
        // (sent by older registration flows that don't have an ownerId)
        if (mongoose.Types.ObjectId.isValid(ownerId)) {
            queryOr.push({ _id: ownerId });
        }
        
        if (email) {
            queryOr.push({ email_address_manager: email });
        }

        const query = { $or: queryOr };

        let cafe = await Cafe.findOne(query).select("-password");

        if (!cafe) {
            return res.status(404).json({ message: "No cafe found for this owner" });
        }
        
        // Auto-link the cafe to this ownerId if found by email but lacks the ownerId
        if (cafe.ownerId !== ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
            await Cafe.updateOne({ _id: cafe._id }, { $set: { ownerId } });
            cafe.ownerId = ownerId;
        }

        // Generate a JWT so the frontend can use it for authenticated API calls
        const token = jwt.sign(
            { id: cafe._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            cafe: {
                id: cafe._id,
                _id: cafe._id,
                ownerId: cafe.ownerId,
                cafeName: cafe.Name,
                Name: cafe.Name,
                location: cafe.cafe_location,
                Cafe_Address: cafe.Cafe_Address,
                tables: cafe.tables,
                status: cafe.status, // true = verified, false = pending
                profilePicture: cafe.profilePicture || "",
                establishmentType: cafe.establishmentType,
                managerName: cafe.managerName,
                Phonenumber: cafe.Phonenumber,
                email_address_manager: cafe.email_address_manager,
                Cafe_photos: cafe.Cafe_photos || [],
                createdAt: cafe.createdAt,
            },
        });
    } catch (error) {
        console.error("Get My Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Verify/approve a cafe (set status to true)
const verifyCafe = async (req, res) => {
    try {
        const cafe = await Cafe.findByIdAndUpdate(
            req.params.id,
            { status: true },
            { new: true }
        );

        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        console.log("✅ Cafe verified:", cafe._id, cafe.Name);

        res.json({
            success: true,
            message: "Cafe verified successfully",
            cafe: {
                id: cafe._id,
                cafeName: cafe.Name,
                status: cafe.status,
            },
        });
    } catch (error) {
        console.error("Verify Cafe Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all approved/verified cafes (public — for user-facing page)
const getApprovedCafes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        console.log("[DEBUG] getApprovedCafes: Fetching approved cafes...");
        
        let cafesQuery = Cafe.find({ status: true })
            .select('Name Cafe_Address cafe_location latitude longitude Average_Cost AboutCafe Cafe_photos profilePicture establishmentType opening_hours managerName Phonenumber tables ownerId createdAt')
            .sort({ createdAt: -1 });
            
        if (limit > 0) {
            cafesQuery = cafesQuery.limit(limit);
        }
            
        const [cafes, totalCount] = await Promise.all([
            cafesQuery.lean(),
            Cafe.countDocuments({ status: true })
        ]);
        console.log(`[DEBUG] getApprovedCafes: Found ${cafes.length} approved cafes out of ${totalCount} total.`);

        // Build list of valid ObjectId identifiers for menu lookup
        const objectIdIdentifiers = [];
        cafes.forEach(c => {
            objectIdIdentifiers.push(c._id);
            // Only include ownerId if it's a valid ObjectId and different from _id
            if (c.ownerId && mongoose.Types.ObjectId.isValid(c.ownerId) && c.ownerId.toString() !== c._id.toString()) {
                objectIdIdentifiers.push(new mongoose.Types.ObjectId(c.ownerId));
            }
        });

        // Fetch menu items using only valid ObjectIds
        let allMenuItems = [];
        if (objectIdIdentifiers.length > 0) {
            try {
                console.log(`[DEBUG] getApprovedCafes: Fetching menu items for ${objectIdIdentifiers.length} identifiers...`);
                allMenuItems = await CafeMenu.find({ cafe_owner: { $in: objectIdIdentifiers }, available: true })
                    .select('item_name Category food_type price description_food image_url available cafe_owner')
                    .lean();
                console.log(`[DEBUG] getApprovedCafes: Found ${allMenuItems.length} menu items.`);
            } catch (menuErr) {
                console.error("Menu fetch error (non-fatal):", menuErr.message);
                // Continue without menu items — cafes should still be displayed
            }
        }

        // Group menu items by cafe_owner
        const menuMap = {};
        allMenuItems.forEach(item => {
            const ownerId = item.cafe_owner.toString();
            if (!menuMap[ownerId]) menuMap[ownerId] = [];
            menuMap[ownerId].push(item);
        });

        // Helper: sanitize image URLs — remove empty, /uploads/ paths
        const sanitizeImageUrl = (url) => {
            if (!url || typeof url !== 'string') return '';
            // Preserve local, base64, and http/https images so they exist on the frontend
            return url; 
        };

        // Attach menu items to each cafe
        const cafesWithMenu = cafes.map(cafe => {
            const idKey = cafe._id.toString();

            const menuFromId = menuMap[idKey] || [];

            // Strict isolation: Only use menus mapped directly to the cafe's _id
            const uniqueMenus = Array.from(new Map(menuFromId.map(item => [item._id.toString(), item])).values());

            // Sanitize image URLs for all menu items
            const sanitizedMenuItems = uniqueMenus.map(item => ({
                ...item,
                image_url: sanitizeImageUrl(item.image_url),
            }));

            // Sanitize cafe photos and profile picture
            const sanitizedCafePhotos = (cafe.Cafe_photos || []).map(p => sanitizeImageUrl(p)).filter(Boolean);
            const sanitizedProfilePic = sanitizeImageUrl(cafe.profilePicture);

            return {
                ...cafe,
                menuItems: sanitizedMenuItems,
                Cafe_photos: sanitizedCafePhotos,
                profilePicture: sanitizedProfilePic,
            };
        });

        res.json({ success: true, cafes: cafesWithMenu, totalCount });
    } catch (error) {
        console.error("getApprovedCafes error:", error.message);
        console.error("getApprovedCafes stack:", error.stack);
        res.status(500).json({ message: "Failed to fetch approved cafes", error: error.message });
    }
};

const testDump = async (req, res) => {
    try {
        const cafes = await Cafe.find({ status: true });
        const menus = await CafeMenu.find();

        const c_data = cafes.map(c => ({
            _id: c._id.toString(),
            name: c.Name,
            ownerId: c.ownerId
        }));

        const m_data = menus.map(m => ({
            _id: m._id.toString(),
            name: m.item_name,
            cafe_owner: m.cafe_owner.toString()
        }));

        res.json({ cafes: c_data, menus: m_data });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
// ─── Update Cafe Photos (Dashboard sync) ─────────────────────────
const updateCafePhotos = async (req, res) => {
    try {
        const { cafeId } = req.params;
        const { cafePhotos, profilePicture } = req.body;

        if (!cafeId) {
            return res.status(400).json({ message: "cafeId is required" });
        }

        const updateData = {};

        // Handle profilePicture if provided
        if (profilePicture) {
            if (typeof profilePicture === 'string' && profilePicture.startsWith('data:')) {
                const url = await uploadBase64ToCloudinary(profilePicture, 'cafes/profiles');
                if (url) updateData.profilePicture = url;
            } else if (typeof profilePicture === 'string' && (profilePicture.startsWith('http') || profilePicture.startsWith('/uploads/'))) {
                updateData.profilePicture = profilePicture;
            }
        }

        // Handle cafePhotos if provided
        if (Array.isArray(cafePhotos)) {
            const processedPhotos = [];
            for (const photo of cafePhotos) {
                if (typeof photo === 'string' && photo.startsWith('data:')) {
                    const url = await uploadBase64ToCloudinary(photo, 'cafes/photos');
                    if (url) processedPhotos.push(url);
                } else if (typeof photo === 'string' && (photo.startsWith('http://') || photo.startsWith('https://'))) {
                    processedPhotos.push(photo);
                } else if (typeof photo === 'string' && photo.startsWith('/uploads/')) {
                    processedPhotos.push(photo);
                }
            }
            updateData.Cafe_photos = processedPhotos;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid data provided for update" });
        }

        const updatedCafe = await Cafe.findByIdAndUpdate(
            cafeId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedCafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        console.log(`📸 Updated images for cafe ${updatedCafe.Name}: ${updateData.Cafe_photos ? updateData.Cafe_photos.length : 'no'} photos, ${updateData.profilePicture ? 'profile pic updated' : 'no profile pic update'}`);

        res.json({
            success: true,
            message: "Cafe images updated successfully",
            cafe: {
                id: updatedCafe._id,
                cafeName: updatedCafe.Name,
                Cafe_photos: updatedCafe.Cafe_photos,
                profilePicture: updatedCafe.profilePicture,
            },
        });
    } catch (error) {
        console.error("Update Cafe Images Error:", error);
        res.status(500).json({ message: "Failed to update images", error: error.message });
    }
};

// ─── Get Meetup Orders for a Cafe (public, by cafeId) ─────────────
const getMeetupOrders = async (req, res) => {
    try {
        const { cafeId } = req.params;
        const MeetupOrder = require("../models/Meetup/MeetupOrder");
        const Meetup = require("../models/Meetup/Meetup");

        // Build a list of possible cafeId values: 
        // the provided cafeId could be the cafe _id, ownerId, or a string
        const possibleCafeIds = [cafeId];

        // Look up cafe to find all associated identifiers 
        try {
            let cafe = null;
            if (mongoose.Types.ObjectId.isValid(cafeId)) {
                cafe = await Cafe.findById(cafeId).lean();
            }
            if (!cafe) {
                cafe = await Cafe.findOne({ ownerId: cafeId }).lean();
            }
            if (cafe) {
                if (cafe._id) possibleCafeIds.push(cafe._id.toString());
                if (cafe.ownerId) possibleCafeIds.push(cafe.ownerId);
            }
        } catch (e) { /* ignore */ }

        const uniqueCafeIds = [...new Set(possibleCafeIds)];

        // Only return orders that have completed token payment or later statuses
        const orders = await MeetupOrder.find({ 
            cafeId: { $in: uniqueCafeIds },
            status: { $in: ["token_paid", "accepted", "ACCEPTED", "completed", "COMPLETED", "confirmed", "CONFIRMED", "READY", "CASH_COLLECTED"] }
        })
            .sort({ createdAt: -1 })
            .lean();

        // Enrich with meetup info
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            let meetupInfo = null;
            try {
                meetupInfo = await Meetup.findById(order.meetupId).select("meetupCode organizerName members selectedCafe").lean();
            } catch (e) { /* ignore */ }

            return {
                orderNumber: order.orderId || order._id.toString().slice(-6).toUpperCase(),
                orderId: order.orderId || order._id.toString(),
                meetupName: meetupInfo ? `Meetup ${meetupInfo.meetupCode}` : "Meetup Order",
                groupName: meetupInfo?.organizerName || order.userName || "Group",
                meetupId: order.meetupId,
                memberCount: meetupInfo?.members?.length || 1,
                items: (order.items || []).map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                })),
                totalAmount: order.total || 0,
                subtotal: order.subtotal || 0,
                cgst: order.cgst || 0,
                sgst: order.sgst || 0,
                orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
                orderTime: new Date(order.createdAt).toLocaleTimeString("en-IN"),
                status: (order.status === "confirmed" || order.status === "token_paid") ? "accepted" : order.status,
                adminName: order.userName || "",
                adminPhone: "",
                createdAt: order.createdAt,
                splitEnabled: order.splitEnabled,
                perPersonAmount: order.perPersonAmount,
                members: order.members || [],
            };
        }));

        res.json({ success: true, orders: enrichedOrders });
    } catch (error) {
        console.error("Get Meetup Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch meetup orders", error: error.message });
    }
};

const getPublicMenu = async (req, res) => {
    try {
        const { cafeId } = req.params;
        if (!cafeId) return res.status(400).json({ message: "cafeId is required" });
        
        const items = await CafeMenu.find({ 
            cafe_owner: cafeId, 
            available: true 
        }).sort({ Category: 1, item_name: 1 });
        
        res.json(items);
    } catch (error) {
        console.error("Get Public Menu Error:", error);
        res.status(500).json({ message: "Failed to fetch menu", error: error.message });
    }
};

module.exports = {
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
    getMyCafe,
    verifyCafe,
    registerCafeSimple,
    getApprovedCafes,
    testDump,
    updateCafePhotos,
    getMeetupOrders,
    getPublicMenu,
};
