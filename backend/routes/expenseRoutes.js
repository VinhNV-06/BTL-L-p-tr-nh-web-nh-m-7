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

router.post("/expenses", addExpense);     
router.get("/expenses", getExpense);           
router.get("/expenses/by-month-year", getExpenseByMonthYear); 
router.put("/expenses/:id", updateExpense);    
router.delete("/expenses/:id", deleteExpense); 

// Tổng chi phí
router.get("/expenses/total", getTotalExpense);

module.exports = router;
