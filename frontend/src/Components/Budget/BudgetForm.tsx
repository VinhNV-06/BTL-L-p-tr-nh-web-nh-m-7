import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";
import { getCategories } from "../../api/categoryApi";
import axios, { AxiosError } from "axios";

interface BudgetFormProps {
  onSuccess?: () => void;
}

interface Category {
  _id: string;
  name: string;
}

interface InputState {
  categoryId: string;
  limit: string;
  month: number;
  year: number;
}

interface ApiErrorResponse {
  message?: string;
}

const API_URL = "http://localhost:5000/api/v1";

const BudgetForm: React.FC<BudgetFormProps> = ({ onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [inputState, setInputState] = useState<InputState>({
    categoryId: "",
    limit: "",
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
        setCategories(res.data);
      } catch (err: unknown) {
        const error = err as AxiosError<ApiErrorResponse>;
        console.error("Lỗi khi lấy danh mục:", error.message);
        setError("Không thể tải danh mục chi tiêu");
      }
    };
    fetchCategories();
  }, []);

  const handleInput =
    (name: keyof InputState) =>
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

      if (!inputState.categoryId || !inputState.limit) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      const limit = Number(inputState.limit);
      if (limit <= 0) throw new Error("Số tiền phải lớn hơn 0");

      await axios.post(
        `${API_URL}/budgets`,
        {
          categoryId: inputState.categoryId,
          limit,
          month: inputState.month,
          year: inputState.year,
        },
        { headers: authHeaders }
      );

      // Reset form
      setInputState({
        categoryId: "",
        limit: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

      onSuccess?.();
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Danh sách tháng/năm
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  return (
    <FormStyled onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="input-control">
        <select
          required
          value={inputState.categoryId}
          onChange={handleInput("categoryId")}
        >
          <option value="">Chọn danh mục chi tiêu</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="input-control">
        <input
          type="number"
          value={inputState.limit}
          onChange={handleInput("limit")}
          placeholder="Nhập hạn mức"
          required
        />
      </div>

      <div className="selects input-control">
        <select
          required
          value={inputState.month}
          onChange={handleInput("month")}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          required
          value={inputState.year}
          onChange={handleInput("year")}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
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

export default BudgetForm;


const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem; /* tăng khoảng cách giữa các khối */

  input,
  select {
    font-family: inherit;
    font-size: 1.05rem; /* chữ to hơn */
    outline: none;
    border: none;
    padding: 0.9rem 1.2rem; /* tăng padding cho rộng rãi */
    border-radius: 8px;
    border: 2px solid #ddd;
    background: #fff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);

    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }

    &:focus {
      border-color: var(--color-accent);
      box-shadow: 0px 0px 8px rgba(0, 150, 255, 0.3);
    }
  }

  .input-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.95rem;
      color: rgba(34, 34, 96, 0.7);
    }

    input,
    select {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .selects {
    display: flex;
    gap: 1.5rem;

    .select-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 1rem;
        font-weight: 500;
        color: rgba(34, 34, 96, 0.8);
      }

      select {
        width: 100%;
      }
    }
  }

  .submit-btn {
    display: flex;
    justify-content: center;

    button {
      font-size: 1.1rem;
      font-weight: 600;
      padding: 1rem 2rem; /* nút to hơn */
      border-radius: 30px;
      background: #ff76ddff !important;
      box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: #de00a6ff !important;
        transform: translateY(-2px);
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
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


