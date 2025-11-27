const router = require("express").Router();

const {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getTotalExpense,
} = require("../controllers/expense");

const {
  addIncome,
  getIncomes,
  deleteIncome,
  getTotalIncome,
} = require("../controllers/income");


router
  .post("/add-income", addIncome)
  .get("/get-incomes", getIncomes)
  .delete("/delete-income/:id", deleteIncome)
  .get("/total-income", getTotalIncome)
  .post("/add-expense", addExpense)
  .get("/get-expenses", getExpense)
  .put("/update-expense/:id", updateExpense)  
  .delete("/delete-expense/:id", deleteExpense);
router.get("/total-expense", getTotalExpense);


module.exports = router;
