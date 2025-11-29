import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

const API: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Category {
  _id: string;
  name: string;
}

export interface Budget {
  _id: string;
  user: string;
  category: Category;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  remaining?: number;
  percentUsed?: number;
  isOverBudget?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Bạn chưa đăng nhập");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const safeFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Lỗi ${response.status}`);
  }
  return response.json();
};

export const addBudget = async (budgetData: {
  category: string;
  amount: number;
  month: number;
  year: number;
}): Promise<Budget> =>
  safeFetch<Budget>(`${BASE_URL}/add-budget`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

export const getBudgets = async (): Promise<Budget[]> =>
  safeFetch<Budget[]>(`${BASE_URL}/get-budgets`, { headers: getAuthHeaders() });

export const getBudgetsByMonth = async (
  month: number,
  year: number
): Promise<Budget[]> =>
  safeFetch<Budget[]>(
    `${BASE_URL}/get-budgets-by-month?month=${month}&year=${year}`,
    {
      headers: getAuthHeaders(),
    }
  );

export const getBudget = async (id: string): Promise<Budget> =>
  safeFetch<Budget>(`${BASE_URL}/get-budget/${id}`, {
    headers: getAuthHeaders(),
  });

export const updateBudget = async (
  id: string,
  budgetData: Partial<{
    category: string;
    amount: number;
    month: number;
    year: number;
  }>
): Promise<Budget> =>
  safeFetch<Budget>(`${BASE_URL}/update-budget/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

export const deleteBudget = async (id: string): Promise<{ message: string }> =>
  safeFetch<{ message: string }>(`${BASE_URL}/delete-budget/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

export const getBudgetOverview = async (
  month?: number,
  year?: number
): Promise<any> => {
  const params = new URLSearchParams();
  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());
  return safeFetch<any>(
    `${BASE_URL}/get-budget-overview${
      params.toString() ? "?" + params.toString() : ""
    }`,
    { headers: getAuthHeaders() }
  );
};
