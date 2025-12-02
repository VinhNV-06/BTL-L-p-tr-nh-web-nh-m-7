import axios from "axios";

const API_URL = "/api/v1";

// Lấy danh sách chi phí
export const getExpenses = () => {
  return axios.get(`${API_URL}/expenses`);
};

// Thêm chi phí mới (không cần month, year)
export const addExpense = (expense: {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}) => {
  return axios.post(`${API_URL}/expenses`, expense);
};

// Cập nhật chi phí (không cần month, year)
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

// Lấy tổng chi phí
export const getTotalExpense = () => {
  return axios.get(`${API_URL}/expenses/total`);
};
