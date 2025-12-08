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

const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gọi API lấy thống kê theo năm 
export const getYearlyStats = async (year: number) => {
  const res = await api.get<YearlyStats>("/stats/year", {
    params: { year },
  });
  return res.data;
};
