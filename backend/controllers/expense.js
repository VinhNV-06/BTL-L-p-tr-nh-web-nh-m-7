const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "Vui lòng điền vào tất cả ô trống!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res
        .status(400)
        .json({ message: "Số tiền phải là một số lớn hơn 0!" });
    }
    await expense.save();
    res.status(200).json({ message: "Thêm khoản chi thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

  console.log(expense);
};

exports.getExpense = async (req, res) => {
  try {
    const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await ExpenseSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Đã xóa chi phí thành công" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
