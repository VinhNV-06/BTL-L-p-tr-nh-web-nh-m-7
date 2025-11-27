const ExpenseSchema = require("../models/ExpenseModel");

// Hàm format số tiền
const formatAmount = (value) => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
};

// Thêm chi phí mới
exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  try {
    // Validations
    if (!title || !category || !description || !date) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền vào tất cả ô trống!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res
        .status(400)
        .json({ message: "Số tiền phải là một số lớn hơn 0!" });
    }

    const expense = new ExpenseSchema({
      title,
      amount,
      category,
      description,
      date,
    });

    await expense.save();
    console.log(expense);
    res.status(200).json({ message: "Thêm khoản chi thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách chi phí, trả thêm trường formattedAmount
exports.getExpense = async (req, res) => {
  try {
    const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });

    const formatted = expenses.map((item) => ({
      ...item.toObject(),
      formattedAmount: formatAmount(item.amount),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa chi phí
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await ExpenseSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Đã xóa chi phí thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Endpoint mới: Tổng chi phí rút gọn
exports.getTotalExpense = async (req, res) => {
  try {
    const expenses = await ExpenseSchema.find();

    const total = expenses.reduce((acc, item) => acc + item.amount, 0);

    res.status(200).json({
      total, // số nguyên
      formattedTotal: formatAmount(total), // rút gọn
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
