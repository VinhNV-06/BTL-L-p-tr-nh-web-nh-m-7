import axios from "axios";

// Kiểu dữ liệu cho từng tháng
export interface MonthStat {
  month: number;  
  spent: number;   
  budget: number;  
  over: number;    
  percent: number; 
}

// Kiểu dữ liệu cho thống kê cả năm
export interface YearlyStats {
  year: number;
  months: MonthStat[];
  totals: {
    spent: number;  
    budget: number;  
    over: number;    
  };
}

// Gọi API lấy thống kê theo năm
export const getYearlyStats = async (year: number) => {
  const res = await axios.get<YearlyStats>("/api/v1/stats/year", {
    params: { year },
  });
  return res.data;
};
