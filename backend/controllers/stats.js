const Expense = require("../models/ExpenseModel");  
const Budget = require("../models/BudgetModel");     

// ✅ Lấy thống kê chi tiêu theo năm
exports.getYearlyStats = async (req, res) => {
  const year = Number(req.query.year);
  if (!year) {
    return res.status(400).json({ message: "Thiếu tham số year" });
  }

  try {
    // 1) Tổng chi tiêu theo tháng
    const expensesAgg = await Expense.aggregate([
      { $match: { year } },
      { $group: { _id: "$month", spent: { $sum: "$amount" } } },
      { $project: { month: "$_id", spent: 1, _id: 0 } },
    ]);

    // 2) Tổng định mức theo tháng
    const budgetsAgg = await Budget.aggregate([
      { $match: { year } },
      { $group: { _id: "$month", budget: { $sum: "$limit" } } },
      { $project: { month: "$_id", budget: 1, _id: 0 } },
    ]);

    // 3) Hợp nhất dữ liệu 12 tháng
    const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
      const e = expensesAgg.find((x) => x.month === m);
      const b = budgetsAgg.find((x) => x.month === m);
      const spent = e?.spent || 0;
      const budget = b?.budget || 0;
      const over = spent > budget ? spent - budget : 0;
      const percent = budget ? Math.round((spent / budget) * 100) : 0;
      return { month: m, spent, budget, over, percent };
    });

    // 4) Tổng cả năm
    const totals = months.reduce(
      (acc, m) => ({
        spent: acc.spent + m.spent,
        budget: acc.budget + m.budget,
        over: acc.over + m.over,
      }),
      { spent: 0, budget: 0, over: 0 }
    );

    res.status(200).json({ year, months, totals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
