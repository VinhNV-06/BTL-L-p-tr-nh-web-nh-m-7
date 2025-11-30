const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getTotalExpense,
} = require("../controllers/expense");

// CRUD cho Expense
router.post("/expenses", addExpense);          // Thêm chi phí mới
router.get("/expenses", getExpense);           // Lấy danh sách chi phí
router.put("/expenses/:id", updateExpense);    // Cập nhật chi phí
router.delete("/expenses/:id", deleteExpense); // Xóa chi phí

// Tổng chi phí
router.get("/expenses/total", getTotalExpense);

module.exports = router;
