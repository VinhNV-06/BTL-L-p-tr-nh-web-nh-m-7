import React from "react";
import { YearlyStats } from "../../api/statsApi";
import styled from "styled-components";
import { formatAmount } from "../../utils/formatAmount"; 

interface Props {
  stats: YearlyStats;
}

const YearSummary: React.FC<Props> = ({ stats }) => {
  const { totals, months } = stats;
  const monthsOver = months.filter((m) => m.over > 0).length;
  const percentOver = Math.round((monthsOver / months.length) * 100);

  const remaining = totals.budget - totals.spent;

  return (
    <SummaryWrapper>
      <SummaryCard>
        <h3>Tổng chi tiêu</h3>
        <p>{formatAmount(totals.spent)}</p>
      </SummaryCard>
      <SummaryCard>
        <h3>Tổng định mức</h3>
        <p>{formatAmount(totals.budget)}</p>
      </SummaryCard>
      <SummaryCard highlight="red">
        <h3>Tổng vượt định mức</h3>
        <p>{formatAmount(totals.over)}</p>
      </SummaryCard>
      <SummaryCard highlight={remaining >= 0 ? "green" : "red"}>
        <h3>Tiền còn dư</h3>
        <p>{formatAmount(remaining)}</p>
      </SummaryCard>
      <SummaryCard highlight={percentOver > 50 ? "red" : "green"}>
        <h3>Tỷ lệ vượt định mức</h3>
        <p>{monthsOver}/{months.length} tháng ({percentOver}%)</p>
      </SummaryCard>
    </SummaryWrapper>
  );
};

export default YearSummary;

const SummaryWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const SummaryCard = styled.div<{ highlight?: string }>`
  flex: 1;
  min-width: 180px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #555;
  }

  p {
    margin-top: 8px;
    font-size: 1.3rem;
    font-weight: 700;
    color: ${({ highlight }) => highlight || "#333"};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;
