import React, { useEffect, useState } from "react";
import { getYearlyStats, YearlyStats } from "../../api/statsApi";
import MonthlyChart from "../Chart/MonthlyChart";
import YearSummary from "../Summary/YearSummary";
import AlertBox from "../AlertBox/AlertBox"; 
import styled from "styled-components";

const HomeDashboard: React.FC = () => {
  const [stats, setStats] = useState<YearlyStats | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getYearlyStats(year);
        setStats(data);
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
      }
    };
    fetchStats();
  }, [year]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <DashboardWrapper>
      <h2>Thống kê chi tiêu năm {year}</h2>

      {/* 🔍 Bộ lọc năm */}
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

      {stats && (
        <>
          <MonthlyChart data={stats.months} />
          <YearSummary stats={stats} />
          <AlertBox stats={stats} />
        </>
      )}
    </DashboardWrapper>
  );
};

export default HomeDashboard;

const DashboardWrapper = styled.div`
  padding: 2rem;
  background: #fcf6f9;
  border-radius: 16px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2rem;

  select {
    padding: 0.6rem 1rem;
    border: 2px solid #d1c4e9;           
    border-radius: 10px;
    font-size: 1rem;
    background: #fdf7ff;               
    color: #4a148c;                  
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
