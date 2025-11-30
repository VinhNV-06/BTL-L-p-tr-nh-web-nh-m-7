import axios from "axios";

const API_URL = "/api/v1";

// Lấy tất cả định mức
export const getBudgets = () => {
  return axios.get(`${API_URL}/budgets`);
};

// Lấy định mức theo tháng/năm
export const getBudgetsByMonth = (month: number, year: number) => {
  return axios.get(`${API_URL}/budgets/by-month`, {
    params: { month, year },
  });
};

// Thêm định mức mới
export const addBudget = (budget: {
  categoryId: string;   
  limit: number;
  month: number;
  year: number;
}) => {
  return axios.post(`${API_URL}/budgets`, budget);
};

// Cập nhật định mức
export const updateBudget = (
  id: string,
  budget: {
    limit: number;
    month: number;
    year: number;
  }
) => {
  return axios.put(`${API_URL}/budgets/${id}`, budget);
};

// Xóa định mức
export const deleteBudget = (id: string) => {
  return axios.delete(`${API_URL}/budgets/${id}`);
};

export interface Budget {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  limit: number;
  month: number;
  year: number;
  isOverBudget?: boolean;
}
