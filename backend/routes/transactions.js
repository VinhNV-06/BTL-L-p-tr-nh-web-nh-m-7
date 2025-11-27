const router = require("express").Router();
const {
  addIncome,
  getIncomes,
  deleteIncome,
  getTotalIncome,
} = require("../controllers/income");
const {
  addExpense,
  getExpense,
  deleteExpense,
  getTotalExpense,
} = require("../controllers/expense");

router
  .post("/add-income", addIncome)
  .get("/get-incomes", getIncomes)
  .delete("/delete-income/:id", deleteIncome)
  .get("/total-income", getTotalIncome)
  .post("/add-expense", addExpense)
  .get("/get-expenses", getExpense)
  .delete("/delete-expense/:id", deleteExpense)
  .get("/total-expense", getTotalExpense);

module.exports = router;
