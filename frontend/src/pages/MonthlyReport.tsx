import React, { useState } from "react";
import TransactionList from "../Components/TransactionList";

const MonthlyReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // ✅ Danh sách định mức cho từng danh mục
  const categoryLimits: Record<string, number> = {
    "Ăn uống": 5000000,
    "Đi lại": 2000000,
    "Giải trí": 2000000,
  };

  // ✅ Giao dịch mẫu
  const transactions = [
    { date: "01/11/2025", category: "Ăn uống", amount: -3000000, month: 11, year: 2025 },
    { date: "15/11/2025", category: "Ăn uống", amount: -2000000, month: 11, year: 2025 },
    { date: "27/11/2025", category: "Ăn uống", amount: -2000000, month: 11, year: 2025 },
    { date: "10/11/2025", category: "Đi lại", amount: -500000, month: 11, year: 2025 },
    { date: "20/11/2025", category: "Giải trí", amount: -250000, month: 11, year: 2025 },
  ];

  // ✅ Lọc theo tháng/năm
  const filteredByMonthYear = transactions.filter(
    (tx) => tx.month === month && tx.year === year
  );

  // ✅ Tính tổng chi tiêu theo danh mục
  const spentByCategory: Record<string, number> = {};
  filteredByMonthYear.forEach((tx) => {
    const cat = tx.category;
    spentByCategory[cat] = (spentByCategory[cat] || 0) + Math.abs(tx.amount);
  });

  // ✅ Tạo danh sách categoryData từ dữ liệu thực tế
  const categoryData = Object.keys(categoryLimits).map((name) => ({
    name,
    spent: spentByCategory[name] || 0,
    limit: categoryLimits[name],
  }));

  // ✅ Lọc giao dịch theo danh mục
  const filteredTransactions =
    selectedCategory === "Tất cả"
      ? filteredByMonthYear
      : filteredByMonthYear.filter((tx) => tx.category === selectedCategory);

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLimit = categoryData.reduce((sum, cat) => sum + cat.limit, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sổ chi tiêu tháng</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Tất cả">Tất cả</option>
          {categoryData.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {selectedCategory === "Tất cả" ? (
          (() => {
            const percent = Math.round((totalSpent / totalLimit) * 100);
            const overLimit = totalSpent > totalLimit;
            return (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4>Tổng chi tiêu tháng {month}/{year}</h4>
                <div style={{ background: "#eee", height: "20px", borderRadius: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(percent, 100)}%`,
                      background: overLimit ? "red" : percent > 80 ? "orange" : "green",
                      height: "100%",
                    }}
                  />
                </div>
                <p>
                  Đã chi: {totalSpent.toLocaleString()} ₫ / Định mức: {totalLimit.toLocaleString()} ₫
                  {overLimit && <span style={{ color: "red", marginLeft: "1rem" }}>⚠️ Vượt định mức</span>}
                </p>
              </div>
            );
          })()
        ) : (
          (() => {
            const cat = categoryData.find((c) => c.name === selectedCategory);
            if (!cat) return null;
            const percent = Math.round((cat.spent / cat.limit) * 100);
            const overLimit = cat.spent > cat.limit;
            return (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4>{cat.name}</h4>
                <div style={{ background: "#eee", height: "20px", borderRadius: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(percent, 100)}%`,
                      background: overLimit ? "red" : percent > 80 ? "orange" : "green",
                      height: "100%",
                    }}
                  />
                </div>
                <p>
                  Đã chi: {cat.spent.toLocaleString()} ₫ / Định mức: {cat.limit.toLocaleString()} ₫
                  {overLimit && <span style={{ color: "red", marginLeft: "1rem" }}>⚠️ Vượt định mức</span>}
                </p>
              </div>
            );
          })()
        )}
      </div>

      <TransactionList
        transactions={filteredTransactions}
        categoryData={categoryData}
        allTransactions={filteredByMonthYear}
      />
    </div>
  );
};

export default MonthlyReport;
