import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { getCategories } from "../../api/categoryApi";
import axios from "axios";

interface BudgetFormProps {
  onSuccess?: () => void;
}

interface Category {
  _id: string;
  name: string;
}

const API_URL = "http://localhost:5000/api/v1";

const BudgetForm: React.FC<BudgetFormProps> = ({ onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [inputState, setInputState] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Lấy danh mục chi tiêu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data); // backend trả mảng trực tiếp
      } catch (err: any) {
        console.error("Lỗi khi lấy danh mục:", err);
        setError("Không thể tải danh mục chi tiêu");
      }
    };
    fetchCategories();
  }, []);

  const handleInput =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setInputState({ ...inputState, [name]: e.target.value });
      setError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!token) throw new Error("Bạn chưa đăng nhập");

      if (!inputState.category || !inputState.amount) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      const amount = Number(inputState.amount);
      if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");

      await axios.post(
        `${API_URL}/add-budget`,
        {
          category: inputState.category,
          amount,
          month: Number(inputState.month),
          year: Number(inputState.year),
        },
        { headers: authHeaders }
      );

      // Reset form
      setInputState({
        category: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);

  return (
    <FormStyled onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Hiển thị danh mục + số tiền */}
      <div className="input-control">
        <input
          type="text"
          value={`Danh mục: ${
            categories.find((c) => c._id === inputState.category)?.name || ""
          } - Số tiền: ${inputState.amount || ""}`}
          placeholder="Danh mục và số tiền"
          disabled
        />
      </div>

      <div className="input-control">
        <input type="text" value="Định mức chi tiêu" disabled />
      </div>

      <div className="input-control">
        <input
          type="number"
          value={inputState.amount}
          onChange={handleInput("amount")}
          placeholder="Nhập số tiền"
          required
        />
      </div>

      <div className="selects input-control">
        <select
          required
          value={inputState.category}
          onChange={handleInput("category")}
        >
          <option value="">Chọn danh mục chi tiêu</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="selects input-control">
        <select
          required
          value={inputState.month}
          onChange={handleInput("month")}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select required value={inputState.year} onChange={handleInput("year")}>
          {years.map((year) => (
            <option key={year} value={year}>
              Năm {year}
            </option>
          ))}
        </select>
      </div>

      <div className="submit-btn">
        <Button
          name={loading ? "Đang lưu..." : "Thêm định mức"}
          icon={plus}
          bPad={".8rem 1.6rem"}
          bRad={"30px"}
          bg={"var(--color-accent)"}
          color={"#fff"}
        />
      </div>
    </FormStyled>
  );
};

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);

    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }

    &:focus {
      border-color: var(--color-accent);
    }

    &:disabled {
      background: rgba(34, 34, 96, 0.05);
      cursor: not-allowed;
    }
  }

  .input-control {
    input,
    select {
      width: 100%;
    }
  }

  .selects {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    select {
      width: 100%;
    }
  }

  .submit-btn {
    button {
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: var(--color-green) !important;
        transform: translateY(-2px);
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 5px;
  color: #c33;
  font-size: 0.9rem;
`;

export default BudgetForm;
