// frontend/src/api/categoryApi.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("Token không tồn tại. Vui lòng đăng nhập.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getCategories = () => API.get(`/categories`);
export const addCategory = (name: string) => API.post(`/categories`, { name });
export const updateCategory = (id: string, name: string) =>
  API.put(`/categories/${id}`, { name });
export const deleteCategory = (id: string) => API.delete(`/categories/${id}`);
