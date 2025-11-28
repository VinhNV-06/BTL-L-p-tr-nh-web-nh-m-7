import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenseApi";
import { getCategories } from "../api/categoryApi";
import { AxiosError } from "axios";
import styled from "styled-components";
import { dateFormat } from "../utils/dateFormat";
import { formatAmount } from "../utils/formatAmount";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Expense {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ApiErrorResponse {
  message?: string;
}

const ExpenseManager: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resExpenses = await getExpenses();
        setExpenses(resExpenses.data);
        const resCategories = await getCategories();
        setCategories(resCategories.data);
      } catch (err: unknown) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const res = await addExpense({
        ...form,
        amount: Number(form.amount),
      });
      setExpenses([...expenses, res.data]);
      setForm({ amount: "", description: "", date: "", category: "" });
      toast.success("Thêm khoản chi thành công");
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Lỗi khi thêm khoản chi");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await updateExpense(id, {
        ...form,
        amount: Number(form.amount),
      });
      setExpenses(expenses.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
      setForm({ amount: "", description: "", date: "", category: "" });
      toast.success("Cập nhật thành công");
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Lỗi khi sửa khoản chi");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e._id !== id));
      toast.success("Đã xóa khoản chi");
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Lỗi khi xóa khoản chi");
    }
  };

  return (
    <ExpenseStyled>
      <h2>Quản lý khoản chi</h2>
      <div className="form">
        <input
          name="amount"
          type="number"
          placeholder="Số tiền"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          name="description"
          type="text"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {editingId ? (
          <button onClick={() => handleUpdate(editingId)}>💾 Lưu</button>
        ) : (
          <button onClick={handleAdd}>➕ Thêm</button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Mô tả</th>
            <th>Số tiền</th>
            <th>Ngày</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{e.description}</td>
              <td>{formatAmount(e.amount)}</td>
              <td>{dateFormat(e.date)}</td>
              <td>
                {categories.find((c) => c._id === e.category)?.name || "Khác"}
              </td>
              <td>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingId(e._id);
                    setForm({
                      amount: e.amount.toString(),
                      description: e.description,
                      date: e.date.slice(0, 10),
                      category: e.category,
                    });
                  }}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(e._id)}
                >
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-right" autoClose={3000} />
    </ExpenseStyled>
  );
};

export default ExpenseManager;

const ExpenseStyled = styled.div`
  padding: 2rem;
  background: #fcf6f9;
  border-radius: 16px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

  h2 {
    margin-bottom: 1rem;
  }

  .form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;

    input,
    select {
      padding: 0.6rem 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 50px;
      background: #4caf50;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s ease;
      &:hover {
        background: #388e3c;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;

    th,
    td {
      padding: 0.8rem 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
    }

    tr:hover {
      background: #fafafa;
    }

    .edit,
    .delete {
      border: none;
      border-radius: 50px;
      padding: 0.4rem 1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .edit {
      background: #e3f2fd;
      color: #1976d2;
      &:hover {
        background: #bbdefb;
      }
    }

    .delete {
      background: #ffebee;
      color: #d32f2f;
      &:hover {
        background: #ffcdd2;
      }
    }
  }
`;
