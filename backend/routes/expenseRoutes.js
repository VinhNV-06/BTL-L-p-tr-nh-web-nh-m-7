const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅ import middleware

const {
  addExpense,
  getExpense,
  getExpenseByMonthYear,
  updateExpense,
  deleteExpense,
  getTotalExpense,
} = require("../controllers/expense");

router.post("/expenses", authMiddleware, addExpense);     
router.get("/expenses", authMiddleware, getExpense);           
router.get("/expenses/by-month-year", authMiddleware, getExpenseByMonthYear); 
router.put("/expenses/:id", authMiddleware, updateExpense);    
router.delete("/expenses/:id", authMiddleware, deleteExpense); 
router.get("/expenses/total", authMiddleware, getTotalExpense);

module.exports = router;
