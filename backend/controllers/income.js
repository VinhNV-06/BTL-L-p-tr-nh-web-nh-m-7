const IncomeSchema = require("../models/IncomeModel");

// Hàm format số tiền
const formatAmount = (value) => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
};

// Thêm income mới
exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "Cần điền tất cả ô trống!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Số tiền phải là số dương!" });
    }

    const income = new IncomeSchema({
      title,
      amount,
      category,
      description,
      date,
    });
    await income.save();
    res.status(200).json({ message: "Số tiền đã được thêm" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách Income kèm formattedAmount
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
    const formatted = incomes.map((item) => ({
      ...item.toObject(),
      formattedAmount: formatAmount(item.amount),
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa Income
exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    await IncomeSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Số tiền đã được xóa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Tổng Income
exports.getTotalIncome = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find();
    const total = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const formattedTotal = formatAmount(total);
    res.status(200).json({ total, formattedTotal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
