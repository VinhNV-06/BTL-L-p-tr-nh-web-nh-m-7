import axios from "axios";

const API_URL = "/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lấy danh sách chi phí toàn bộ
export const getExpenses = () => {
  return api.get("/expenses");
};

// Lấy chi phí theo tháng/năm
export const getExpensesByMonthYear = (month: number, year: number) => {
  return api.get("/expenses/by-month-year", {
    params: { month, year },
  });
};

// Thêm chi phí mới
export const addExpense = (expense: {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}) => {
  return api.post("/expenses", expense);
};

// Cập nhật chi phí
export const updateExpense = (
  id: string,
  expense: {
    amount: number;
    description: string;
    date: string;
    categoryId: string;
  }
) => {
  return api.put(`/expenses/${id}`, expense);
};

// Xóa chi phí
export const deleteExpense = (id: string) => {
  return api.delete(`/expenses/${id}`);
};

// Lấy tổng chi phí (có thể lọc theo tháng/năm)
export const getTotalExpense = (month?: number, year?: number) => {
  return api.get("/expenses/total", {
    params: { month, year },
  });
};
