import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BudgetForm from "../Components/Budget/BudgetForm";
import { getBudgetsByMonth, deleteBudget } from "../api/budgetApi";
import type { Budget } from "../api/budgetApi";

const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBudgetsByMonth(selectedMonth, selectedYear);
      setBudgets(res.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải định mức";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa định mức này?")) return;

    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể xóa định mức";
      alert(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  return (
    <BudgetManagerStyled>
      <h1>Quản lý định mức chi tiêu</h1>

      <ContentWrapper>
        <FormSection>
          <SectionTitle>Thiết lập định mức mới</SectionTitle>
          <BudgetForm onSuccess={fetchBudgets} />
        </FormSection>

        <ListSection>
          <SectionTitle>Danh sách định mức</SectionTitle>

          <FilterSection>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </FilterSection>

          {loading && <LoadingMessage>Đang tải...</LoadingMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {!loading && budgets.length === 0 && (
            <EmptyState>
              Chưa có định mức nào cho tháng {selectedMonth}/{selectedYear}
            </EmptyState>
          )}

          <BudgetList>
            {budgets.map((budget) => (
              <BudgetItem key={budget._id}>
                <div className="info">
                  <p className="label">
                    <span className="title">Danh mục:</span>{" "}
                    {budget.category?.name || "Không có tên"}
                  </p>
                  <p className="label">
                    <span className="title">Hạn mức:</span>{" "}
                    {formatCurrency(budget.limit)}
                  </p>
                  <p className="time">
                    Tháng {budget.month}/{budget.year}
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(budget._id)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </BudgetItem>
            ))}
          </BudgetList>
        </ListSection>
      </ContentWrapper>
    </BudgetManagerStyled>
  );
};

export default BudgetManager;

// Styled-components
const BudgetManagerStyled = styled.div`
  padding: 2rem;
  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: rgba(34, 34, 96, 0.9);
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  height: fit-content;
`;

const ListSection = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: rgba(34, 34, 96, 0.9);
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  select {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: #fcf6f9;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    font-size: 1rem;
    color: rgba(34, 34, 96, 0.9);
    outline: none;
    &:focus {
      border-color: var(--color-accent);
    }
  }
`;

const BudgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BudgetItem = styled.div`
  background: #fcf6f9;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }

  .info {
    flex-direction: column;

    .label {
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(34, 34, 96, 0.9);
      font-family: "Segoe UI", sans-serif;
    }

    .title {
      font-weight: 600;
      color: var(--color-accent);
      margin-right: 0.2rem;
      font-family: "Segoe UI", sans-serif;
    }

    .time {
      font-size: 0.95rem;
      color: rgba(34, 34, 96, 0.7);
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;

    .delete-btn {
      padding: 0.5rem 1rem;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      &:hover {
        background: #ee2f3a;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
  padding: 1rem;
  text-align: center;
  color: rgba(34, 34, 96, 0.6);
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: rgba(34, 34, 96, 0.6);
  font-size: 1.1rem;
  background: #fcf6f9;
  border-radius: 15px;
`;
