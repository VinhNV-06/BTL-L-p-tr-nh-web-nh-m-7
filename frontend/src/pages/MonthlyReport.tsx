import React, { useState, useEffect } from "react";
import TransactionList from "../Components/TransactionList/TransactionList";
import { getExpenses } from "../api/expenseApi";
import { getBudgetsByMonth } from "../api/budgetApi";
import { getCategories } from "../api/categoryApi";
import styled from "styled-components";

//Khai báo kiểu dữ liệu
interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  month: number;
  year: number;
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface Budget {
  _id: string;
  category: Category;
  limit: number;
}

const MonthlyReport: React.FC = () => {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>({});
  const [categories, setCategories] = useState<Category[]>([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resExpenses = await getExpenses();
        setTransactions(resExpenses.data as Transaction[]);

        const resBudgets = await getBudgetsByMonth(month, year);
        const limits = (resBudgets.data as Budget[]).reduce(
          (acc: Record<string, number>, b: Budget) => {
            acc[b.category?.name || "Khác"] = b.limit;
            return acc;
          },
          {}
        );
        setCategoryLimits(limits);

        const resCategories = await getCategories();
        setCategories(resCategories.data as Category[]);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err);
      }
    };
    fetchData();
  }, [month, year]);

  const filteredByMonthYear = transactions.filter(
    (tx) => tx.month === month && tx.year === year
  );

  const spentByCategory: Record<string, number> = {};
  filteredByMonthYear.forEach((tx) => {
    const cat = tx.category?.name || "Khác";
    spentByCategory[cat] = (spentByCategory[cat] || 0) + Math.abs(tx.amount);
  });

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    spent: spentByCategory[cat.name] || 0,
    limit: categoryLimits[cat.name] || 0,
  }));

  const filteredTransactions =
    selectedCategory === "Tất cả"
      ? filteredByMonthYear
      : filteredByMonthYear.filter((tx) => tx.category?.name === selectedCategory);

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLimit = categoryData.reduce((sum, cat) => sum + cat.limit, 0);

  return (
    <ReportWrapper>
      <h2>Sổ chi tiêu tháng</h2>

      {/* Bộ lọc */}
      <FilterBar>
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
          <option value="Tất cả">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </FilterBar>

      {/* Thanh tiến độ */}
      <ProgressSection>
        {selectedCategory === "Tất cả" ? (
          (() => {
            const percent = totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0;
            const overLimit = totalSpent > totalLimit;
            return (
              <ProgressCard>
                <h4>Tổng chi tiêu tháng {month}/{year}</h4>
                <ProgressBar>
                  <ProgressFill
                    percent={percent}
                    color={overLimit ? "red" : percent > 80 ? "orange" : "green"}
                  />
                </ProgressBar>
                <p>
                  Đã chi: {totalSpent.toLocaleString()} ₫ / Định mức: {totalLimit.toLocaleString()} ₫
                  {overLimit && <span className="warning">⚠️ Vượt định mức</span>}
                </p>
              </ProgressCard>
            );
          })()
        ) : (
          (() => {
            const cat = categoryData.find((c) => c.name === selectedCategory);
            if (!cat) return null;
            const percent = cat.limit ? Math.round((cat.spent / cat.limit) * 100) : 0;
            const overLimit = cat.spent > cat.limit;
            return (
              <ProgressCard>
                <h4>{cat.name}</h4>
                <ProgressBar>
                  <ProgressFill
                    percent={percent}
                    color={overLimit ? "red" : percent > 80 ? "orange" : "green"}
                  />
                </ProgressBar>
                <p>
                  Đã chi: {cat.spent.toLocaleString()} ₫ / Định mức: {cat.limit.toLocaleString()} ₫
                  {overLimit && <span className="warning">⚠️ Vượt định mức</span>}
                </p>
              </ProgressCard>
            );
          })()
        )}
      </ProgressSection>

      <TransactionList
        transactions={filteredTransactions}
        categoryData={categoryData}
        allTransactions={filteredByMonthYear}
      />
    </ReportWrapper>
  );
};

export default MonthlyReport;

// ✅ Styled-components
const ReportWrapper = styled.div`
  padding: 2rem;
  background: #fcf6f9;
  border-radius: 16px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

  h2 {
    margin-bottom: 1rem;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  select {
    padding: 0.6rem 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: rgba(34, 34, 96, 0.9);
    }
  }
`;

const ProgressSection = styled.div`
  margin-top: 2rem;
`;

const ProgressCard = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }

  p {
    margin-top: 0.8rem;
    font-size: 1rem;
    color: #555;

    .warning {
      color: #d32f2f;
      font-weight: 600;
      margin-left: 1rem;
      background: #ffebee;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
    }
  }
`;

const ProgressBar = styled.div`
  position: relative;
  background: #eee;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; color: string }>`
  width: ${({ percent }) => Math.min(percent, 100)}%;
  background: ${({ color }) =>
    color === "red"
      ? "linear-gradient(to right, #ef5350, #e53935)"
      : color === "orange"
      ? "linear-gradient(to right, #ffb74d, #ffa726)"
      : "linear-gradient(to right, #81c784, #66bb6a)"};
  height: 100%;
  transition: width 0.4s ease;
  position: relative;

  &::after {
    content: "${({ percent }) => percent}%";
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
  }
`;

            