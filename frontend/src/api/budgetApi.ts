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

// Lấy tất cả định mức
export const getBudgets = () => {
  return api.get("/budgets");
};

// Lấy định mức theo tháng/năm
export const getBudgetsByMonth = (month: number, year: number) => {
  return api.get("/budgets/by-month", {
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
  return api.post("/budgets", budget);
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
  return api.put(`/budgets/${id}`, budget);
};

// Xóa định mức
export const deleteBudget = (id: string) => {
  return api.delete(`/budgets/${id}`);
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
