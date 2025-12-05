import React from "react";
import { YearlyStats } from "../../api/statsApi";
import styled from "styled-components";
import { formatAmount } from "../../utils/formatAmount"; 
import {
  totalBudget,
  budgetOver,
  percentOver2,
} from "../../utils/Icons";

interface Props {
  stats: YearlyStats;
}

const YearSummary: React.FC<Props> = ({ stats }) => {
  const { totals, months } = stats;
  const monthsOver = months.filter((m) => m.over > 0).length;
  const percentOver = Math.round((monthsOver / months.length) * 100);

  return (
    <SummaryWrapper>
      <Card>
        <div className="card-header">
          <h3>Tổng định mức</h3>
          <span className="icon budget-icon">{totalBudget}</span>
        </div>
        <p className="amount">{formatAmount(totals.budget)}</p>
        <div className="card-footer">
          <span className="info-text">Định mức cả năm</span>
        </div>
      </Card>

      <Card>
        <div className="card-header">
          <h3>Tổng vượt định mức</h3>
          <span className="icon expense-icon">{budgetOver}</span>
        </div>
        <p className="amount over-amount">{formatAmount(totals.over)}</p>
        <div className="card-footer">
          <span className="info-text over-budget">Chi tiêu vượt định mức</span>
        </div>
      </Card>

      <Card>
        <div className="card-header">
          <h3>Tỷ lệ vượt định mức</h3>
          <span className="icon average-icon">{percentOver2}</span>
        </div>
        <p
          className={`amount ${
            percentOver > 50 ? "over-amount" : "budget-amount"
          }`}
        >
          {monthsOver}/{months.length} tháng ({percentOver}%)
        </p>
        <div className="card-footer">
          <span
            className={`info-text ${
              percentOver > 50 ? "over-budget" : ""
            }`}
          >
            {percentOver > 50
              ? "Tỷ lệ vượt cao"
              : "Kiểm soát tốt định mức"}
          </span>
        </div>
      </Card>
    </SummaryWrapper>
  );
};

export default YearSummary;

const SummaryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled.div`
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
`;
