const Favorite = require("../models/Favorite");
const Cafe = require("../models/Cafe/Cafe_login");
const CafeMenu = require("../models/Cafe/cafe_menu");
const mongoose = require("mongoose");

async function attachMenuToCafe(cafe) {
  const idKey = cafe._id.toString();
  const owners = [cafe._id];
  if (cafe.ownerId && mongoose.Types.ObjectId.isValid(cafe.ownerId)) {
    owners.push(new mongoose.Types.ObjectId(cafe.ownerId));
  }
  const menuItems = await CafeMenu.find({
    cafe_owner: { $in: owners },
    available: true,
  })
    .select("item_name Category food_type price description_food image_url available cafe_owner")
    .lean();

  const photos = (cafe.Cafe_photos || []).filter(
    (p) => typeof p === "string" && (p.startsWith("http://") || p.startsWith("https://")),
  );

  return {
    ...cafe,
    _id: idKey,
    cloudinaryImages: photos,
    menuItems,
    costForOne: cafe.Average_Cost,
    verified: cafe.status === true,
    phone: cafe.Phonenumber,
    rating: cafe.rating ?? 4.5,
    coordinates: {
      lat: cafe.latitude ?? 0,
      lng: cafe.longitude ?? 0,
    },
  };
}

/** GET /api/favorites */
const listFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const itemType = req.query.itemType || "cafe";
    const rows = await Favorite.find({ userId, itemType }).sort({ savedAt: -1 }).lean();
    const ids = rows.map((r) => itemType === "event" ? r.eventId : r.cafeId).filter(Boolean);

    if (!ids.length) {
      return res.json({ success: true, favorites: [], ids: [] });
    }

    const objectIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    
    if (itemType === "event") {
      const Event = require("../models/Event");
      const events = await Event.find({ _id: { $in: objectIds } }).lean();
      
      const orderMap = new Map(ids.map((id, i) => [id, i]));
      events.sort((a, b) => (orderMap.get(a._id.toString()) ?? 0) - (orderMap.get(b._id.toString()) ?? 0));
      
      return res.json({
        success: true,
        favorites: events,
        ids: events.map((e) => e._id),
      });
    }

    // Default to cafes
    const cafes = await Cafe.find({ _id: { $in: objectIds }, status: true }).lean();

    const enriched = await Promise.all(cafes.map(attachMenuToCafe));
    const orderMap = new Map(ids.map((id, i) => [id, i]));
    enriched.sort((a, b) => (orderMap.get(a._id) ?? 0) - (orderMap.get(b._id) ?? 0));

    res.json({
      success: true,
      favorites: enriched,
      cafeIds: enriched.map((c) => c._id),
      ids: enriched.map((c) => c._id),
    });
  } catch (error) {
    console.error("listFavorites:", error);
    res.status(500).json({ message: "Failed to load favorites", error: error.message });
  }
};

/** GET /api/favorites/ids */
const listFavoriteIds = async (req, res) => {
  try {
    const itemType = req.query.itemType || "cafe";
    const rows = await Favorite.find({ userId: req.userId, itemType }).lean();
    const ids = rows.map((r) => itemType === "event" ? r.eventId : r.cafeId).filter(Boolean);
    res.json({ success: true, cafeIds: ids, ids: ids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** POST /api/favorites/toggle { cafeId, eventId, itemType } */
const toggleFavorite = async (req, res) => {
  try {
    const { cafeId, eventId, itemType = "cafe" } = req.body;
    const userId = req.userId;

    const idToToggle = itemType === "event" ? eventId : cafeId;

    if (!idToToggle) {
      return res.status(400).json({ message: "Id is required" });
    }

    const query = { userId, itemType };
    if (itemType === "event") {
      query.eventId = eventId;
    } else {
      query.cafeId = cafeId;
    }

    const existing = await Favorite.findOne(query);
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ success: true, loved: false, id: idToToggle, cafeId });
    }

    await Favorite.create({ ...query, savedAt: new Date() });
    
    let item = null;
    if (itemType === "event" && mongoose.Types.ObjectId.isValid(eventId)) {
      const Event = require("../models/Event");
      item = await Event.findOne({ _id: eventId }).lean();
      return res.json({ success: true, loved: true, id: idToToggle, event: item });
    } else if (mongoose.Types.ObjectId.isValid(cafeId)) {
      const raw = await Cafe.findOne({ _id: cafeId, status: true }).lean();
      if (raw) item = await attachMenuToCafe(raw);
    }
    return res.json({ success: true, loved: true, id: idToToggle, cafeId, cafe: item });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: true, loved: true, id: req.body.eventId || req.body.cafeId });
    }
    console.error("toggleFavorite:", error);
    res.status(500).json({ message: "Failed to update favorite", error: error.message });
  }
};

module.exports = { listFavorites, listFavoriteIds, toggleFavorite, attachMenuToCafe };
