const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const {
  listFavorites,
  listFavoriteIds,
  toggleFavorite,
} = require("../controllers/favorite.controller");

router.get("/", authUser, listFavorites);
router.get("/ids", authUser, listFavoriteIds);
router.post("/toggle", authUser, toggleFavorite);

module.exports = router;
