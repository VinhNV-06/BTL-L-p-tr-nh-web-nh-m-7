import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const getCategories = () => axios.get(`${API_URL}/categories`);
export const addCategory = (name: string) => axios.post(`${API_URL}/categories`, { name });
export const updateCategory = (id: string, name: string) => axios.put(`${API_URL}/categories/${id}`, { name });
export const deleteCategory = (id: string) => axios.delete(`${API_URL}/categories/${id}`);
