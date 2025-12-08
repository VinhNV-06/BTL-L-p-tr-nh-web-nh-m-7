const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const { getYearlyStats } = require("../controllers/stats");

// Lấy thống kê theo năm 
router.get("/stats/year", authMiddleware, getYearlyStats);

module.exports = router;
