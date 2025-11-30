const express = require("express");
const router = express.Router();
const {
  addBudget,
  getBudgets,
  getBudgetsByMonth,
  updateBudget,
  deleteBudget,
  checkBudgetStatus,
} = require("../controllers/budgetController");

// Thêm định mức
router.post("/budgets", addBudget);

// Lấy tất cả định mức
router.get("/budgets", getBudgets);

// Lấy định mức theo tháng/năm (query: ?month=11&year=2025)
router.get("/budgets/by-month", getBudgetsByMonth);

// Cập nhật định mức
router.put("/budgets/:id", updateBudget);

// Xóa định mức
router.delete("/budgets/:id", deleteBudget);

module.exports = router;
