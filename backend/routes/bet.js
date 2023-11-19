const express = require("express");
const router = express.Router();
const { createBet, deleteBet } = require("../controllers/betController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createBet);
router.delete("/delete/:betId", protect, deleteBet);

module.exports = router;
