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
  category: {
    _id: string;
    name: string;
  };
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
    categoryId: "", 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
      const d = new Date(form.date);
      const res = await addExpense({
        ...form,
        amount: Number(form.amount),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
      setExpenses([...expenses, res.data]);
      setForm({ amount: "", description: "", date: "", categoryId: "" });
      toast.success("Thêm khoản chi thành công");
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Lỗi khi thêm khoản chi");
    }
  };


  const handleUpdate = async (id: string) => {
    try {
      const d = new Date(form.date);
      const res = await updateExpense(id, {
        ...form,
        amount: Number(form.amount),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
      setExpenses(expenses.map((e) => (e._id === id ? res.data : e)));
      setEditingId(null);
      setShowEditModal(false);
      setForm({ amount: "", description: "", date: "", categoryId: "" });
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

  // ✅ Tính tổng số tiền đã chi
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ExpenseStyled>
      <h2>Quản lý khoản chi</h2>
      {/* Form thêm mới */}
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
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={handleAdd}>➕ Thêm</button>
      </div>
      <div className="table-wrapper">
        

      {/* ✅ Tổng số tiền đã chi */}
      <p className="total">Tổng số tiền đã chi: {formatAmount(totalAmount)}</p>

      {/* Bảng danh sách */}
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
              <td>{e.category?.name || "Khác"}</td>
              <td>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingId(e._id);
                    setForm({
                      amount: e.amount.toString(),
                      description: e.description,
                      date: e.date.slice(0, 10),
                      categoryId: e.category._id,
                    });
                    setShowEditModal(true);
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
      </div>

      {/* Modal chỉnh sửa */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chỉnh sửa khoản chi</h3>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={() => handleUpdate(editingId!)}>💾 Lưu</button>
              <button onClick={() => setShowEditModal(false)}>❌ Hủy</button>
            </div>
          </div>
        </div>
      )}


      <ToastContainer position="top-right" autoClose={3000} />
    </ExpenseStyled>
  );
};

export default ExpenseManager;

const ExpenseStyled = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  height: 84%;

  h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: center;
    flex-wrap: wrap;

    input,
    select {
      padding: 0.6rem 1rem;
      border: 2px solid #E0E0E0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
      input:hover,
      select:hover{
           transform: translateY(-1px);
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
           border-color: #C0C0C0;
      }
      input:focus,
      select:focus{
         outline: none;
         border-color: #DDA0DD;
         box-shadow: 0 0 0 2px rgba(221, 160, 221, 0.2);
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
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      &:hover {
        background: #388e3c;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
      }

    }
  }
  .table-wrapper{
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;

  }

  .table-wrapper table {
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
      position: sticky;
      top: 0;
      z-index: 10;
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
      transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
      gap: 0.5rem;
    }

    .edit {
      background: #e3f2fd;
      color: #1976d2;
      &:hover {
        background: #bbdefb;
        transform: scale(1.1);
      }
    }

    .delete {
      background: #ffebee;
      color: #d32f2f;
      &:hover {
        background: #ffcdd2;
        transform: scale(1.1);
      }
    }
  }

  .modal {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    width: 450px;
    box-shadow: 0px 8px 20px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: fadeIn 0.3s ease;
  }

  .modal-content h3 {
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    text-align: center;
  }

  .modal-content input,
  .modal-content select {
    padding: 0.7rem 1rem;
    border: 1.5px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .modal-content input:focus,
  .modal-content select:focus {
    border-color: #4caf50;
    outline: none;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }

  .modal-buttons button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s ease;
    color: #fff;
  }

  .modal-buttons button:first-child {
    background: #4caf50;
  }
  .modal-buttons button:first-child:hover {
    background: #388e3c;
  }

  .modal-buttons button:last-child {
    background: #9e9e9e;
  }
  .modal-buttons button:last-child:hover {
    background: #757575;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .total {
    font-size: 1.2rem;
    font-weight: 600;
    color: #d32f2f;
    margin: 1rem 0;
    text-align: right; /* hoặc left tùy bạn muốn */
  }
`;
