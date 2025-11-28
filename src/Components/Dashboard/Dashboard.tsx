import React, { useEffect, FC } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/useGlobalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import { dollar } from "../../utils/Icons";
import Chart from "../Chart/Chart";

// Hàm rút gọn số
const formatAmount = (value: number) => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toString();
};

interface Transaction {
  amount: number;
  formattedAmount?: string;
  date: string;
}

const Dashboard: FC = () => {
  const {
    incomes,
    expenses,
    formattedTotalIncome,
    formattedTotalExpense,
    totalBalance,
    getIncomes,
    getExpenses,
  } = useGlobalContext() as any;

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  // Min / Max Income & Expense
  const minIncome = incomes.length
    ? Math.min(...incomes.map((i: Transaction) => i.amount))
    : 0;
  const maxIncome = incomes.length
    ? Math.max(...incomes.map((i: Transaction) => i.amount))
    : 0;
  const minExpense = expenses.length
    ? Math.min(...expenses.map((e: Transaction) => e.amount))
    : 0;
  const maxExpense = expenses.length
    ? Math.max(...expenses.map((e: Transaction) => e.amount))
    : 0;

  return (
    <DashboardStyled>
      <InnerLayout>
        <h1>All Transactions</h1>
        <div className="stats-con">
          <div className="chart-con">
            <Chart />
            <div className="amount-con">
              <div className="income">
                <h2>Total Income</h2>
                <p>
                  {dollar}{" "}
                  {formattedTotalIncome ||
                    formatAmount(incomes.reduce((a, b) => a + b.amount, 0))}
                </p>
              </div>
              <div className="expense">
                <h2>Total Expense</h2>
                <p>
                  {dollar}{" "}
                  {formattedTotalExpense ||
                    formatAmount(expenses.reduce((a, b) => a + b.amount, 0))}
                </p>
              </div>
              <div className="balance">
                <h2>Total Balance</h2>
                <p>
                  {dollar} {formatAmount(totalBalance())}
                </p>
              </div>
            </div>
          </div>
          <div className="history-con">
            <History />
            <h2 className="salary-title">
              Min <span>Income</span> Max
            </h2>
            <div className="salary-item">
              <p>${formatAmount(minIncome)}</p>
              <p>${formatAmount(maxIncome)}</p>
            </div>
            <h2 className="salary-title">
              Min <span>Expense</span> Max
            </h2>
            <div className="salary-item">
              <p>${formatAmount(minExpense)}</p>
              <p>${formatAmount(maxExpense)}</p>
            </div>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
};

const DashboardStyled = styled.div`
  .stats-con {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;

    .chart-con {
      grid-column: 1 / 4;
      height: 400px;

      .amount-con {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin-top: 2rem;

        .income,
        .expense {
          grid-column: span 2;
        }

        .income,
        .expense,
        .balance {
          background: #fcf6f9;
          border: 2px solid #ffffff;
          box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 1rem;

          p {
            font-size: 3.5rem;
            font-weight: 700;
          }
        }

        .balance {
          grid-column: 2 / 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          p {
            color: var(--color-green);
            opacity: 0.6;
            font-size: 4.5rem;
          }
        }
      }
    }

    .history-con {
      grid-column: 4 / -1;

      h2 {
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .salary-title {
        font-size: 1.2rem;

        span {
          font-size: 1.8rem;
        }
      }

      .salary-item {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
          font-weight: 600;
          font-size: 1.6rem;
        }
      }
    }
  }
`;

export default Dashboard;
