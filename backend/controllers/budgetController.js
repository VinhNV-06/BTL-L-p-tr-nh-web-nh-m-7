const Budget = require("../models/BudgetModel");
const Expense = require("../models/ExpenseModel");

// Thêm định mức
exports.addBudget = async (req, res) => {
  const { categoryId, limit, month, year } = req.body;

  try {
    if (!categoryId || !limit || !month || !year) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết" });
    }

    const budget = new Budget({
      category: categoryId,
      limit,
      month,
      year,
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách định mức
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("category", "name");
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy định mức theo tháng/năm
exports.getBudgetsByMonth = async (req, res) => {
  const { month, year } = req.query;
  try {
    const budgets = await Budget.find({ month, year }).populate("category", "name");
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật định mức
exports.updateBudget = async (req, res) => {
  const { id } = req.params;
  const { limit, month, year } = req.body;

  try {
    const updated = await Budget.findByIdAndUpdate(
      id,
      { limit, month, year },
      { new: true }
    ).populate("category", "name");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy định mức" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa định mức
exports.deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Budget.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy định mức" });
    }
    res.status(200).json({ message: "Đã xóa định mức thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

