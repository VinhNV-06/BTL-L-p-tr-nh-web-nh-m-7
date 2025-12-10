const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 

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
router.post("/expenses", authMiddleware, async (req, res) => {
  const { amount, description, categoryId, month, year } = req.body;

  // kiểm tra định mức
  const budgets = await Budget.find({ month, year, user: req.userId });
  const hasBudget = budgets.some(b => b.category.toString() === categoryId);

  const expense = new Expense({ amount, description, category: categoryId, month, year, user: req.userId });
  await expense.save();

  if (!hasBudget) {
    return res.json({
      message: "Khoản chi đã được thêm, nhưng danh mục này chưa có định mức. Vui lòng đặt định mức!",
      expense
    });
  }

  res.json({ message: "Thêm khoản chi thành công", expense });
});

module.exports = router;
