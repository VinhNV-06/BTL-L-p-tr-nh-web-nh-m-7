import axios from "axios";

const API_URL = "/api/v1";

// Lấy danh sách chi phí toàn bộ
export const getExpenses = () => {
  return axios.get(`${API_URL}/expenses`);
};

// Lấy chi phí theo tháng/năm
export const getExpensesByMonthYear = (month: number, year: number) => {
  return axios.get(`${API_URL}/expenses/by-month-year`, {
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
  return axios.post(`${API_URL}/expenses`, expense);
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
  return axios.put(`${API_URL}/expenses/${id}`, expense);
};

// Xóa chi phí
export const deleteExpense = (id: string) => {
  return axios.delete(`${API_URL}/expenses/${id}`);
};

// Lấy tổng chi phí (có thể lọc theo tháng/năm)
export const getTotalExpense = (month?: number, year?: number) => {
  return axios.get(`${API_URL}/expenses/total`, {
    params: { month, year },
  });
};
