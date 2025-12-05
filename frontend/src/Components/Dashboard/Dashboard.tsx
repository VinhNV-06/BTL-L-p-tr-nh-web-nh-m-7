import React, { useEffect, useState } from "react";
import { getYearlyStats, YearlyStats } from "../../api/statsApi";
import MonthlyChart from "../Chart/MonthlyChart";
import YearSummary from "../Summary/YearSummary";
import AlertBox from "../AlertBox/AlertBox";
import styled from "styled-components";
import { useGlobalContext } from "../../context/useGlobalContext";
import { InnerLayout } from "../../styles/Layouts";
import axios from "axios";
import { formatAmount } from "../../utils/formatAmount";
import {
  totalExpense2,
  budgetRemaining2,
  averageExpense2,
} from "../../utils/Icons";

interface Transaction {
  amount: number;
  formattedAmount?: string;
  date: string;
  category?: { _id: string; name: string };
}

interface Budget {
  _id: string;
  category: { _id: string; name: string };
  limit: number;
  month: number;
  year: number;
  spent?: number;
  percentage?: number;
}

interface CategoryExpense {
  category: string;
  total: number;
  count: number;
}

const HomeDashboard: React.FC = () => {
  const [stats, setStats] = useState<YearlyStats | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { expenses, getExpenses } = useGlobalContext();

  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    getExpenses();
    fetchBudgets();
    fetchStats();
  }, []);

  // Budgets khi expenses hoặc year thay đổi
  useEffect(() => {
    if (expenses.length > 0) {
      fetchBudgets();
    }
  }, [expenses, year]);

  // Stats khi năm thay đổi
  useEffect(() => {
    fetchStats();
  }, [year]);

  // Yearly stats
  const fetchStats = async () => {
    try {
      const data = await getYearlyStats(year);
      setStats(data);
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  };

  // Budgets theo năm được chọn
const fetchBudgets = async () => {
  try {
    const allMonthsBudgets: Budget[] = [];
    for (let month = 1; month <= 12; month++) {
      try {
        const response = await axios.get<Budget[]>(
          `http://localhost:5000/api/v1/budgets/by-month?month=${month}&year=${year}`
        );
        allMonthsBudgets.push(...response.data);
      } catch (error: unknown) {
        // Tháng không có budget thì bỏ qua
        if (axios.isAxiosError(error)) {
          console.error(`Lỗi tải budget tháng ${month}:`, error.message);
        } else {
          console.error(`Lỗi không xác định khi tải budget tháng ${month}`);
        }
      }
    }

    // Tính spent cho mỗi budget dựa trên expenses đã lọc
    const budgetsWithSpent: Budget[] = allMonthsBudgets.map((budget) => {
      const spent = filteredExpenses
        .filter(
          (exp: Transaction) =>
            exp.category?._id === budget.category._id &&
            new Date(exp.date).getMonth() + 1 === budget.month
        )
        .reduce((sum: number, exp: Transaction) => sum + exp.amount, 0);

      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      return { ...budget, spent, percentage };
    });

    setBudgets(budgetsWithSpent);
  } catch (error) {
    console.error("Error fetching budgets:", error);
  }
};


  // Lọc expenses theo năm được chọn
  const filteredExpenses = expenses.filter((exp: Transaction) => {
    const expYear = new Date(exp.date).getFullYear();
    return expYear === year;
  });

  // Tính toán thống kê theo năm được chọn
  const totalExpense = filteredExpenses.reduce(
    (a: number, b: Transaction) => a + b.amount,
    0
  );
  const averageExpense =
    filteredExpenses.length > 0 ? totalExpense / filteredExpenses.length : 0;
  const minExpense = filteredExpenses.length
    ? Math.min(...filteredExpenses.map((e: Transaction) => e.amount))
    : 0;
  const maxExpense = filteredExpenses.length
    ? Math.max(...filteredExpenses.map((e: Transaction) => e.amount))
    : 0;

  // Tính expenses theo category cho năm được chọn
  const expensesByCategory: CategoryExpense[] = filteredExpenses.reduce(
    (
      acc: CategoryExpense[],
      exp: Transaction & { category?: { name: string } }
    ) => {
      const categoryName = exp.category?.name || "Khác";
      const existing = acc.find((item) => item.category === categoryName);

      if (existing) {
        existing.total += exp.amount;
        existing.count += 1;
      } else {
        acc.push({ category: categoryName, total: exp.amount, count: 1 });
      }

      return acc;
    },
    []
  );

  expensesByCategory.sort((a, b) => b.total - a.total);
  const topCategories = expensesByCategory.slice(0, 5);

  // Tính tổng budget 
  const totalBudgetLimit = stats ? stats.totals.budget : 0;
  const totalBudgetSpent = stats ? stats.totals.spent : 0;
  const budgetRemaining = totalBudgetLimit - totalBudgetSpent;

  /*   const budgetPercentage =
    totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0; */

  // Tạo năm cho dropdown
  const currentYearNow = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearNow - 2 + i);

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="dashboard-header">
          <h1>Tổng Quan Chi Tiêu</h1>
          <p className="subtitle">
            Quản lý và theo dõi chi tiêu của bạn - năm {year}
          </p>
        </div>

        {/* Bộ lọc năm */}
        <FilterBar>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </FilterBar>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card expense-card">
            <div className="card-header">
              <h3>Tổng Chi Tiêu</h3>
              <span className="icon expense-icon">{totalExpense2}</span>
            </div>
            <p className="amount">{formatAmount(totalExpense)}</p>
            <div className="card-footer">
              <span className="info-text">
                {filteredExpenses.length} giao dịch
              </span>
            </div>
          </div>
          <div className="card budget-card">
            <div className="card-header">
              <h3>Định Mức Còn Lại</h3>
              <span className="icon budget-icon">{budgetRemaining2}</span>
            </div>
            <p
              className={`amount ${
                budgetRemaining >= 0 ? "budget-amount" : "over-amount"
              }`}
            >
              {formatAmount(Math.abs(budgetRemaining))}
            </p>
            <div className="card-footer">
              <span
                className={`info-text ${
                  budgetRemaining < 0 ? "over-budget" : ""
                }`}
              >
                {budgetRemaining < 0
                  ? `Vượt ${formatAmount(Math.abs(budgetRemaining))}`
                  : budgetRemaining === 0
                  ? "Vừa đủ định mức"
                  : "Còn dư trong định mức"}
              </span>
            </div>
          </div>
          
          <div className="card average-card">
            <div className="card-header">
              <h3>Chi Tiêu Trung Bình</h3>
              <span className="icon average-icon">{averageExpense2}</span>
            </div>
            <p className="amount">{formatAmount(averageExpense)}</p>
            <div className="card-footer">
              <span className="info-text">Trung bình / giao dịch</span>
            </div>
          </div>
        </div>
        {stats && <YearSummary stats={stats} />}

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Chart Section - Sử dụng data từ stats (code mới) */}
          <div className="chart-section">
            <div className="section-header">
              <h2>Biểu Đồ Chi Tiêu Năm {year}</h2>
            </div>
            {stats && <MonthlyChart data={stats.months} />}
          </div>

          {/* Budget Tracking */}
          <div className="budget-section">
            <div className="section-header">
              <h2>Theo Dõi Định Mức</h2>
              <span className="month-label">Năm {year}</span>
            </div>
            <div className="budget-list">
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <div key={budget._id} className="budget-item">
                    <div className="budget-info">
                      <h4>
                        {budget.category.name} (Tháng {budget.month})
                      </h4>
                      <div className="budget-amounts">
                        <span className="spent">
                          {formatAmount(budget.spent || 0)}
                        </span>
                        <span className="separator">/</span>
                        <span className="limit">
                          {formatAmount(budget.limit)}
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${
                          budget.percentage! > 100
                            ? "over-budget"
                            : budget.percentage! > 80
                            ? "warning"
                            : "safe"
                        }`}
                        style={{
                          width: `${Math.min(budget.percentage!, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="budget-status">
                      <span
                        className={`percentage ${
                          budget.percentage! > 100 ? "over" : ""
                        }`}
                      >
                        {budget.percentage!.toFixed(0)}%
                      </span>
                      {budget.percentage! > 100 && (
                        <span className="over-text">
                          Vượt {formatAmount(budget.spent! - budget.limit)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>📋 Chưa có định mức</p>
                  <small>Thêm định mức để theo dõi chi tiêu tốt hơn</small>
                </div>
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="categories-section">
            <div className="section-header">
              <h2>Top 5 Danh Mục Chi Nhiều</h2>
            </div>
            <div className="category-list">
              {topCategories.length > 0 ? (
                topCategories.map((cat, index) => (
                  <div key={index} className="category-item">
                    <div className="category-rank">{index + 1}</div>
                    <div className="category-info">
                      <h4>{cat.category}</h4>
                      <p className="category-count">{cat.count} giao dịch</p>
                    </div>
                    <div className="category-amount">
                      {formatAmount(cat.total)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Chưa có dữ liệu chi tiêu</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-section">
            <div className="section-header">
              <h2>Thống Kê Chi Tiết</h2>
            </div>

            <div className="stat-box">
              <h3>Chi Tiêu Cao/Thấp</h3>
              <div className="stat-row">
                <span className="label">Thấp nhất:</span>
                <span className="value">{formatAmount(minExpense)}</span>
              </div>
              <div className="stat-row">
                <span className="label">Cao nhất:</span>
                <span className="value highlight">
                  {formatAmount(maxExpense)}
                </span>
              </div>
              <div className="stat-row">
                <span className="label">Trung bình:</span>
                <span className="value">{formatAmount(averageExpense)}</span>
              </div>
            </div>

            <div className="stat-box">
              <h3>Tổng Quan</h3>
              <div className="stat-row">
                <span className="label">Tổng giao dịch:</span>
                <span className="value">{filteredExpenses.length}</span>
              </div>
              <div className="stat-row">
                <span className="label">Định mức đặt:</span>
                <span className="value">{budgets.length} danh mục</span>
              </div>
              <div className="stat-row">
                <span className="label">Danh mục có chi:</span>
                <span className="value">{expensesByCategory.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Year Summary & Alert Box từ code mới */}
        {stats && (
          <div className="additional-sections">
            <AlertBox stats={stats} />
          </div>
        )}
      </InnerLayout>
    </DashboardStyled>
  );
};

const DashboardStyled = styled.div`
  .dashboard-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2.5rem;
      color: #222260;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: rgba(34, 34, 96, 0.6);
      font-size: 1rem;
    }
  }

  /* Summary Cards */
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .card {
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.2rem;
          color: rgba(34, 34, 96, 0.7);
          font-weight: 500;
        }

        .icon {
          font-size: 2rem;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .expense-icon {
          background: rgba(255, 82, 82, 0.1);
        }

        .average-icon {
          background: rgba(99, 102, 241, 0.1);
        }

        .budget-icon {
          background: rgba(16, 185, 129, 0.1);
        }
      }

      .amount {
        font-size: 2.5rem;
        font-weight: 700;
        color: #222260;
        margin-bottom: 0.5rem;

        &.budget-amount {
          color: #10b981;
        }

        &.over-amount {
          color: #ef4444;
        }
      }

      .card-footer {
        .info-text {
          font-size: 0.875rem;
          color: rgba(34, 34, 96, 0.6);

          &.over-budget {
            color: #ff5252;
            font-weight: 600;
          }
        }
      }
    }
  }

  /* Main Grid */
  .main-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
    margin-top: 2rem;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        font-size: 1.5rem;
        color: #222260;
      }

      .month-label {
        font-size: 0.875rem;
        color: rgba(34, 34, 96, 0.6);
        background: rgba(34, 34, 96, 0.05);
        padding: 0.5rem 1rem;
        border-radius: 20px;
      }
    }

    .chart-section {
      grid-column: span 8;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1.5rem;
    }

    .budget-section {
      grid-column: span 4;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1.5rem;
      max-height: 500px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(34, 34, 96, 0.05);
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(34, 34, 96, 0.2);
        border-radius: 10px;

        &:hover {
          background: rgba(34, 34, 96, 0.3);
        }
      }

      .budget-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .budget-item {
          background: white;
          padding: 1rem;
          border-radius: 15px;
          box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.04);

          .budget-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;

            h4 {
              font-size: 1rem;
              color: #222260;
              font-weight: 600;
            }

            .budget-amounts {
              font-size: 0.875rem;

              .spent {
                color: #222260;
                font-weight: 600;
              }

              .separator {
                margin: 0 0.25rem;
                color: rgba(34, 34, 96, 0.4);
              }

              .limit {
                color: rgba(34, 34, 96, 0.6);
              }
            }
          }

          .progress-bar {
            height: 8px;
            background: rgba(34, 34, 96, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 0.5rem;

            .progress-fill {
              height: 100%;
              border-radius: 10px;
              transition: width 0.3s ease;

              &.safe {
                background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
              }

              &.warning {
                background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
              }

              &.over-budget {
                background: linear-gradient(90deg, #ef4444 0%, #ff5252 100%);
              }
            }
          }

          .budget-status {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .percentage {
              font-size: 0.875rem;
              font-weight: 600;
              color: #10b981;

              &.over {
                color: #ef4444;
              }
            }

            .over-text {
              font-size: 0.75rem;
              color: #ef4444;
              font-weight: 600;
            }
          }
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: rgba(34, 34, 96, 0.5);

          p {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }

          small {
            font-size: 0.875rem;
          }
        }
      }
    }

    .categories-section {
      grid-column: span 8;
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1.5rem;

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .category-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s;

          &:hover {
            transform: translateX(5px);
          }

          .category-rank {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            font-weight: 700;
            font-size: 0.875rem;
          }

          .category-info {
            flex: 1;

            h4 {
              font-size: 0.95rem;
              color: #222260;
              font-weight: 600;
              margin-bottom: 0.25rem;
            }

            .category-count {
              font-size: 0.75rem;
              color: rgba(34, 34, 96, 0.6);
              margin: 0;
            }
          }

          .category-amount {
            font-size: 1.1rem;
            font-weight: 700;
            color: #222260;
          }
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: rgba(34, 34, 96, 0.5);
        }
      }
    }

    .stats-section {
      grid-column: span 4;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .stat-box {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1.5rem;

        h3 {
          font-size: 1.1rem;
          color: #222260;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid rgba(34, 34, 96, 0.1);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            font-size: 0.875rem;
            color: rgba(34, 34, 96, 0.6);
          }

          .value {
            font-size: 1rem;
            font-weight: 600;
            color: #222260;

            &.highlight {
              color: #ef4444;
            }
          }
        }
      }
    }
  }

  /* Additional sections */
  .additional-sections {
    margin-top: 2rem;
  }

  /* Responsive */
  @media screen and (max-width: 1200px) {
    .main-grid {
      .chart-section,
      .budget-section,
      .categories-section,
      .stats-section {
        grid-column: span 12;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .dashboard-header h1 {
      font-size: 2rem;
    }

    .summary-cards {
      grid-template-columns: 1fr;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  label {
    font-size: 1rem;
    font-weight: 600;
    color: #4a148c;
  }

  select {
    padding: 0.6rem 1rem;
    border: 2px solid #d1c4e9;
    border-radius: 10px;
    font-size: 1rem;
    background: #fdf7ff;
    color: #370079ff;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #7e57c2;
      background-color: #f3e5f5;
    }

    &:focus {
      outline: none;
      border-color: #7e57c2;
      box-shadow: 0 0 6px rgba(126, 87, 194, 0.4);
    }
  }
`;

export default HomeDashboard;