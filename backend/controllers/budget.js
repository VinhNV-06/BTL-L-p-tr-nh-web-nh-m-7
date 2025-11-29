const BudgetModel = require("../models/BudgetModel");
const CategoryModel = require("../models/CategoryModel");
const ExpenseModel = require("../models/ExpenseModel");

const getUserId = (req) => {
  if (req.user && req.user._id) return req.user._id;
  if (req.userId) return req.userId;
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ Using mock user ID for development");
    return process.env.MOCK_USER_ID || "673e0cc95a8c5b1c4c9e6743";
  }
  return null;
};

// Thêm định mức
exports.addBudget = async (req, res) => {
  const { category, amount, month, year } = req.body;
  const userId = getUserId(req);

  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });
  if (!category || !amount || !month || !year) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists)
      return res.status(404).json({ message: "Danh mục không tồn tại" });

    const budget = await BudgetModel.findOneAndUpdate(
      { user: userId, category, month, year },
      { user: userId, category, amount, month, year },
      { new: true, upsert: true, runValidators: true }
    ).populate("category", "name");

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy tất cả định mức
exports.getBudgets = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const budgets = await BudgetModel.find({ user: userId })
      .populate("category", "name")
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy định mức theo tháng/năm
exports.getBudgetsByMonth = async (req, res) => {
  const { month, year } = req.query;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const budgets = await BudgetModel.find({ user: userId, month, year })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const totalSpent = await ExpenseModel.aggregate([
          {
            $match: {
              user: userId,
              category: budget.category._id,
              $expr: {
                $and: [
                  { $eq: [{ $month: "$date" }, Number(month)] },
                  { $eq: [{ $year: "$date" }, Number(year)] },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
        const remaining = budget.amount - spent;
        const percentUsed =
          budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentUsed: Number(percentUsed.toFixed(2)),
          isOverBudget: spent > budget.amount,
        };
      })
    );

    res.status(200).json(budgetsWithSpending);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy 1 định mức
exports.getBudget = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const budget = await BudgetModel.findOne({
      _id: id,
      user: userId,
    }).populate("category", "name");

    if (!budget)
      return res.status(404).json({ message: "Không tìm thấy định mức" });

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa định mức
exports.deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const budget = await BudgetModel.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!budget)
      return res.status(404).json({ message: "Không tìm thấy định mức" });

    res.status(200).json({ message: "Xóa định mức thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật định mức
exports.updateBudget = async (req, res) => {
  const { id } = req.params;
  const { amount, month, year, category } = req.body;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const updated = await BudgetModel.findOneAndUpdate(
      { _id: id, user: userId },
      { amount, month, year, category },
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy định mức" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Tổng quan ngân sách
exports.getBudgetOverview = async (req, res) => {
  const { month, year } = req.query;
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Vui lòng đăng nhập" });

  try {
    const now = new Date();
    const numMonth = month ? Number(month) : now.getMonth() + 1;
    const numYear = year ? Number(year) : now.getFullYear();

    const budgets = await BudgetModel.find({
      user: userId,
      month: numMonth,
      year: numYear,
    }).populate("category", "name");

    const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

    const totalExpenses = await ExpenseModel.aggregate([
      {
        $match: {
          user: userId,
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, numMonth] },
              { $eq: [{ $year: "$date" }, numYear] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const totalRemaining = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    res.status(200).json({
      month: numMonth,
      year: numYear,
      totalBudget,
      totalSpent,
      totalRemaining,
      percentUsed: Number(percentUsed.toFixed(2)),
      isOverBudget: totalSpent > totalBudget,
      budgetCount: budgets.length,
    });
  } catch (error) {
    console.error("Error in getBudgetOverview:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
