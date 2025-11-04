const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const income = IncomeSchema({
    title,
    amount,
    category,
    description,
    date,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "Cần điền tất cả chỗ trống!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Số tiền phải là số dương!" });
    }
    await income.save();
    res.status(200).json({ message: "Số tiền đã được thêm" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

  console.log(income);
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    await IncomeSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Số tiền đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
