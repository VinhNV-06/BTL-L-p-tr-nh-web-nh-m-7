import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MonthStat } from "../../api/statsApi";
import styled from "styled-components";

interface Props {
  data: MonthStat[];
}

const MonthlyChart: React.FC<Props> = ({ data }) => {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(m) => `Tháng ${m}`} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => value.toLocaleString("vi-VN") + " ₫"}
          />

          <Bar dataKey="spent" name="Đã chi" fill="#4caf50" />
          <Bar dataKey="budget" name="Định mức" fill="#2196f3" />
          <Bar dataKey="over" name="Vượt định mức" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>

      <LegendWrapper>
        <LegendItem color="#4caf50">
          Đã chi
          <div className="tooltip">Tổng số tiền đã chi trong tháng</div>
        </LegendItem>
        <LegendItem color="#2196f3">
          Định mức
          <div className="tooltip">Ngân sách đặt ra cho tháng</div>
        </LegendItem>
        <LegendItem color="#f44336">
          Vượt định mức
          <div className="tooltip">Chi tiêu vượt quá định mức tháng này</div>
        </LegendItem>
      </LegendWrapper>
    </ChartWrapper>
  );
};

export default MonthlyChart;

const ChartWrapper = styled.div`
  width: 100%;
  svg {
    cursor: pointer;  
  }
`;

const LegendWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div<{ color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #555;
  cursor: default;

  &::before {
    content: "";
    width: 14px;
    height: 14px;
    background-color: ${({ color }) => color};
    border-radius: 3px;
    display: inline-block;
  }

  &:hover {
    color: ${({ color }) => color};
    cursor: pointer;
  }

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(-4px);
  }

  .tooltip {
    position: absolute;
    bottom: 120%;
    left: 0;
    background: #333;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.95rem;
    line-height: 1.4; 
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: 10;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 10px;
      border-width: 6px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }
`;
