const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅ import middleware

const {
  addBudget,
  getBudgets,
  getBudgetsByMonth,
  updateBudget,
  deleteBudget,
  checkBudgetStatus,
} = require("../controllers/budgetController");

// Thêm định mức
router.post("/budgets", authMiddleware, addBudget);

// Lấy tất cả định mức
router.get("/budgets", authMiddleware, getBudgets);

// Lấy định mức theo tháng/năm 
router.get("/budgets/by-month", authMiddleware, getBudgetsByMonth);

// Cập nhật định mức
router.put("/budgets/:id", authMiddleware, updateBudget);

// Xóa định mức
router.delete("/budgets/:id", authMiddleware, deleteBudget);

// Nếu có API kiểm tra trạng thái định mức
// router.get("/budgets/status", authMiddleware, checkBudgetStatus);

module.exports = router;
