const express = require("express");
const router = express.Router();
const { getAllEvents } = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);

module.exports = router;
