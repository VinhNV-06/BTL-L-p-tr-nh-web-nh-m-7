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
      const data = await getBudgetsByMonth(selectedMonth, selectedYear);
      setBudgets(data);
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

  // Danh sách tháng/năm
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);

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
            {Array.isArray(budgets) ? (
              budgets.map((budget) => (
                <BudgetItem
                  key={budget._id}
                  $isOverBudget={budget.isOverBudget}
                >
                  <div className="info">
                    <h3>{budget.category?.name || "Không có tên"}</h3>
                    <p className="amount">{formatCurrency(budget.amount)}</p>

                    {budget.spent !== undefined && (
                      <div className="spending">
                        <p className="spent">
                          Đã chi: {formatCurrency(budget.spent)}
                        </p>
                        <p className="remaining">
                          Còn lại: {formatCurrency(budget.remaining || 0)}
                        </p>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{
                              width: `${Math.min(
                                budget.percentUsed || 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="percent">
                          {(budget.percentUsed || 0).toFixed(1)}% đã sử dụng
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(budget._id)}
                  >
                    Xóa
                  </button>
                </BudgetItem>
              ))
            ) : (
              <p>Không có dữ liệu ngân sách</p>
            )}
          </BudgetList>
        </ListSection>
      </ContentWrapper>
    </BudgetManagerStyled>
  );
};

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
    padding: 0.75rem 1rem;
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

interface BudgetItemProps {
  $isOverBudget?: boolean;
}

const BudgetItem = styled.div<BudgetItemProps>`
  background: #fcf6f9;
  border: 2px solid ${(props) => (props.$isOverBudget ? "#ff4757" : "#FFFFFF")};
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }

  .info {
    flex: 1;

    h3 {
      font-size: 1.2rem;
      color: rgba(34, 34, 96, 0.9);
      margin-bottom: 0.5rem;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: 0.75rem;
    }

    .spending {
      margin-top: 1rem;
      font-size: 0.9rem;

      .spent {
        color: #ff4757;
        margin-bottom: 0.25rem;
      }

      .remaining {
        color: #2ed573;
        margin-bottom: 0.5rem;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(34, 34, 96, 0.1);
        border-radius: 10px;
        overflow: hidden;
        margin: 0.5rem 0;

        .progress {
          height: 100%;
          background: ${(props) =>
            props.$isOverBudget ? "#ff4757" : "var(--color-accent)"};
          transition: width 0.3s ease;
        }
      }

      .percent {
        color: rgba(34, 34, 96, 0.7);
        font-size: 0.85rem;
      }
    }
  }

  .delete-btn {
    padding: 0.5rem 1.5rem;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      background: #ee2f3a;
      transform: scale(1.05);
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
`;

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

export default BudgetManager;
