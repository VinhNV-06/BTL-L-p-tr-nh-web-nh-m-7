const Expense = require("../models/ExpenseModel");
const Category = require("../models/CategoryModel");

// Thêm chi phí mới
exports.addExpense = async (req, res) => {
  const { amount, categoryId, description, date } = req.body;

  try {
    if (!categoryId || !description || !date) {
      return res.status(400).json({ message: "Vui lòng điền vào tất cả ô trống!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Số tiền phải là một số lớn hơn 0!" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    const d = new Date(date);

    const expense = new Expense({
      amount,
      category: categoryId,
      description,
      date: d,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy toàn bộ chi phí
exports.getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ createdAt: -1 })
      .populate("category", "name");

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy chi phí theo tháng/năm
exports.getExpenseByMonthYear = async (req, res) => {
  const { month, year } = req.query;

  try {
    if (!month || !year) {
      return res.status(400).json({ message: "Thiếu tham số month hoặc year" });
    }

    const expenses = await Expense.find({
      month: Number(month),
      year: Number(year),
    })
      .sort({ date: -1 })
      .populate("category", "name");

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật chi phí
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, categoryId, description, date } = req.body;

  try {
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
    }

    const d = new Date(date);

    const updated = await Expense.findByIdAndUpdate(
      id,
      {
        amount,
        category: categoryId,
        description,
        date: d,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      },
      { new: true }
    ).populate("category", "name");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy khoản chi" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa chi phí
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy khoản chi" });
    }
    res.status(200).json({ message: "Đã xóa chi phí thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Tổng chi phí
exports.getTotalExpense = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);

    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
