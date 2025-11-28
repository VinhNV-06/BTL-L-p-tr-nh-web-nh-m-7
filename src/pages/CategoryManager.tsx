import React, { useEffect, useState } from "react";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../api/categoryApi";
import { AxiosError } from "axios";
import styled from "styled-components";

interface Category {
  _id: string;
  name: string;
}

interface ApiErrorResponse {
  message?: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err: unknown) {
        const error = err as AxiosError<ApiErrorResponse>;
        alert(error.response?.data?.message || "Lỗi khi tải danh mục");
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const res = await addCategory(newName);
      setCategories([...categories, res.data]);
      setNewName("");
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      alert(error.response?.data?.message || "Lỗi khi thêm danh mục");
    }
  };

  const handleEditClick = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSave = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await updateCategory(id, editName);
      setCategories(categories.map(c => (c._id === id ? res.data : c)));
      setEditingId(null);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      alert(error.response?.data?.message || "Lỗi khi sửa danh mục");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      setDeletingId(null);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      alert(error.response?.data?.message || "Lỗi khi xóa danh mục");
    }
  };

  return (
    <CategoryStyled>
      <h2>Quản lý danh mục chi tiêu</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Tên danh mục mới"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Thêm</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c._id} className={editingId === c._id ? "editing" : ""}>
              <td>
                {editingId === c._id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                ) : (
                  c.name
                )}
              </td>
              <td>
                {editingId === c._id ? (
                  <>
                    <button className="save" onClick={() => handleSave(c._id)}>Lưu</button>
                    <button className="cancel" onClick={() => setEditingId(null)}>Hủy</button>
                  </>
                ) : deletingId === c._id ? (
                  <>
                    <span className="confirm-text">Bạn có xác nhận xoá?</span>
                    <button className="confirm" onClick={() => confirmDelete(c._id)}>Đồng ý</button>
                    <button className="cancel" onClick={() => setDeletingId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="edit" onClick={() => handleEditClick(c._id, c.name)}>Sửa</button>
                    <button className="delete" onClick={() => handleDeleteClick(c._id)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CategoryStyled>
  );
};

export default CategoryManager;

const CategoryStyled = styled.div`
  padding: 2rem;
  background: #fcf6f9;
  border-radius: 16px;
  box-shadow: 0px 1px 15px rgba(0,0,0,0.06);

  h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;

    input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      background: var(--color-green, #4caf50);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s ease;

      &:hover {
        background: #43a047;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;

    th, td {
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

    tr.editing {
      background: #fffde7; 
    }

    input {
      padding: 0.4rem 0.6rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    button {
      margin-right: 0.5rem;
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: 0.3s ease;
    }

    .edit {
      background: #2196f3;
      color: #fff;
      &:hover { background: #1976d2; }
    }

    .delete {
      background: #f44336;
      color: #fff;
      &:hover { background: #d32f2f; }
    }

    .save {
      background: #4caf50;
      color: #fff;
      &:hover { background: #388e3c; }
    }

    .cancel {
      background: #9e9e9e;
      color: #fff;
      &:hover { background: #757575; }
    }

    .confirm {
      background: #f44336;
      color: #fff;
      &:hover { background: #d32f2f; }
    }

    .confirm-text {
      margin-right: 0.5rem;
      font-weight: 500;
      color: #444;
    }
  }
`;
