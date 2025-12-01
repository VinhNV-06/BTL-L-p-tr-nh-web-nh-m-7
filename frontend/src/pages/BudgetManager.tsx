import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom"; 
import BudgetForm from "../Components/Budget/BudgetForm";
import { getBudgetsByMonth, deleteBudget, updateBudget } from "../api/budgetApi";
import type { Budget } from "../api/budgetApi";

const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

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

  const handleUpdateClick = (budget: Budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget) return;

    try {
      const res = await updateBudget(editingBudget._id, {
        limit: editingBudget.limit,
        month: editingBudget.month,
        year: editingBudget.year,
      });
      setBudgets((prev) =>
        prev.map((b) => (b._id === editingBudget._id ? res.data : b))
      );
      setShowModal(false);
      setEditingBudget(null);
    } catch (err) {
      alert("Không thể cập nhật định mức");
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
                    className="update-btn"
                    onClick={() => handleUpdateClick(budget)}
                  >
                    ✏️ Sửa
                  </button>
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

      {/* ✅ Modal render bằng Portal */}
      {showModal && editingBudget &&
        createPortal(
          <ModalOverlay>
            <ModalContent>
              <h3>Cập nhật hạn mức</h3>
              <form onSubmit={handleUpdateSubmit}>
                <label>
                  Hạn mức:
                  <input
                    type="number"
                    value={editingBudget.limit}
                    onChange={(e) =>
                      setEditingBudget({
                        ...editingBudget,
                        limit: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">💾 Lưu</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>❌ Hủy</button>
                </div>
              </form>
            </ModalContent>
          </ModalOverlay>,
          document.body
        )
      }
    </BudgetManagerStyled>
  );
};

export default BudgetManager;

const BudgetManagerStyled = styled.div`
  padding: 2rem;
  position: relative;
  z-index: 1;

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #333;
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

const ListSection = styled.div`
  height: 500px;
  padding-right: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
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
    outline: none;
    transition: all 0.3s ease-in-out;
    
    &:hover{
      transform: scale(1.07);
      border-color: #b6c9f9ff;
      box-shadow: 0 0 5px rgba(247, 164, 199, 0.5);
      cursor: pointer;
    }

    &:focus {
      border-color: #b7d6fbff;
      box-shadow: 0 0 8px rgba(179, 206, 249, 0.8);
      transform: scale(1.07);
    }
  }
`;

const BudgetList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 15px;
  overflow-x: hidden;
  margin-top: 1.5rem;
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
      color: rgba(0, 0, 108, 0.7);
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;

    .update-btn,
    .delete-btn {
      min-width: 70px;
      height: 32px;
      padding: 0 0.6rem;
      font-size: 0.85rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      transition: background 0.2s ease;
    }

    .update-btn {
      background: #ffa502;
      color: white;

      &:hover {
        background: #e67e22;
      }
    }

    .delete-btn {
      background: #ff4757;
      color: white;

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
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  text-align: center;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  font-size: 1.1rem;
  background: #fcf6f9;
  border-radius: 15px;
`;

/* ✅ Modal styles FIXED */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 350px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  input {
    width: 100%;
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .save-btn,
  .cancel-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }

  .save-btn {
    background: #2ecc71;
    color: white;

    &:hover {
      background: #27ae60;
    }
  }

  .cancel-btn {
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
    }
  }
`;
