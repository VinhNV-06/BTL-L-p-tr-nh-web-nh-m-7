const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpense,
  getExpenseByMonthYear,
  updateExpense,
  deleteExpense,
  getTotalExpense,
} = require("../controllers/expense");

// ✅ CRUD cho Expense
router.post("/expenses", addExpense);          // Thêm chi phí mới
router.get("/expenses", getExpense);           // Lấy toàn bộ danh sách chi phí
router.get("/expenses/by-month-year", getExpenseByMonthYear); // Lấy chi phí theo tháng/năm
router.put("/expenses/:id", updateExpense);    // Cập nhật chi phí
router.delete("/expenses/:id", deleteExpense); // Xóa chi phí

// ✅ Tổng chi phí
router.get("/expenses/total", getTotalExpense);

module.exports = router;
