const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addBudget,
  getBudgets,
  getBudgetsByMonth,
  getBudget,
  deleteBudget,
  updateBudget,
  getBudgetOverview,
} = require("../controllers/budget");

// Áp dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware);

// Routes quản lý định mức chi tiêu
router.post("/add-budget", addBudget);
router.get("/get-budgets", getBudgets);
router.get("/get-budgets-by-month", getBudgetsByMonth);
router.get("/get-budget-overview", getBudgetOverview);
router.get("/get-budget/:id", getBudget);
router.put("/update-budget/:id", updateBudget);
router.delete("/delete-budget/:id", deleteBudget);

module.exports = router;
