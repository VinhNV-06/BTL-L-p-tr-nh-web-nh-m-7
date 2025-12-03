const express = require("express");
const router = express.Router();
const { getYearlyStats } = require("../controllers/stats");

router.get("/stats/year", getYearlyStats);

module.exports = router;
