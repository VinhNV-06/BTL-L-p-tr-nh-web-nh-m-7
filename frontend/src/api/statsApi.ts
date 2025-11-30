import axios from "axios";

// ✅ Kiểu dữ liệu cho từng tháng
export interface MonthStat {
  month: number;   // tháng (1–12)
  spent: number;   // số tiền đã chi
  budget: number;  // số tiền định mức
  over: number;    // số tiền vượt quá (nếu có)
  percent: number; // % sử dụng ngân sách
}

// ✅ Kiểu dữ liệu cho thống kê cả năm
export interface YearlyStats {
  year: number;
  months: MonthStat[];
  totals: {
    spent: number;   // tổng đã chi cả năm
    budget: number;  // tổng định mức cả năm
    over: number;    // tổng vượt mức cả năm
  };
}

// ✅ Hàm gọi API lấy thống kê theo năm
export const getYearlyStats = async (year: number) => {
  const res = await axios.get<YearlyStats>("/api/v1/stats/year", {
    params: { year },
  });
  return res.data;
};
