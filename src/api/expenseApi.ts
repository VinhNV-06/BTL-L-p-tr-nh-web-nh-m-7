import axios from "axios";

const API_URL = "/api/v1";

// Lấy danh sách chi phí
export const getExpenses = () => {
  return axios.get(`${API_URL}/get-expenses`);
};

// Thêm chi phí mới
export const addExpense = (expense: {
  amount: number;
  description: string;
  date: string;
  category: string;
}) => {
  return axios.post(`${API_URL}/add-expense`, expense);
};

// Cập nhật chi phí
export const updateExpense = (
  id: string,
  expense: {
    amount: number;
    description: string;
    date: string;
    category: string;
  }
) => {
  return axios.put(`${API_URL}/update-expense/${id}`, expense);
};

// Xóa chi phí
export const deleteExpense = (id: string) => {
  return axios.delete(`${API_URL}/delete-expense/${id}`);
};

// Lấy tổng chi phí
export const getTotalExpense = () => {
  return axios.get(`${API_URL}/total-expense`);
};
