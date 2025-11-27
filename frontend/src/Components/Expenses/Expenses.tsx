import React, { useEffect, FC } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/useGlobalContext";
import { InnerLayout } from "../../styles/Layouts";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import { Transaction } from "../../context/types";

const Expenses: FC = () => {
  const { expenses, getExpenses, deleteExpense, formattedTotalExpense } =
    useGlobalContext() as unknown as {
      expenses: Transaction[];
      getExpenses: () => Promise<void>;
      deleteExpense: (id: string) => Promise<void>;
      formattedTotalExpense: string;
    };

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h1>Expenses</h1>
        {/* Hiển thị tổng rút gọn từ backend */}
        <h2 className="total-income">
          Total Expense: <span>${formattedTotalExpense}</span>
        </h2>

        <div className="income-content">
          <div className="form-container">
            <ExpenseForm />
          </div>
          <div className="incomes">
            {expenses.map((expense) => {
              const {
                _id = "",
                title = "",
                amount = 0,
                date = "",
                category = "",
                description = "",
                type = "expense",
                formattedAmount = "",
              } = expense;

              return (
                <IncomeItem
                  key={_id}
                  id={_id}
                  title={title}
                  description={description}
                  // Nếu có formattedAmount từ backend thì hiển thị, fallback về amount
                  amount={formattedAmount || amount}
                  originalAmount={amount} // optional
                  date={date}
                  type={type}
                  category={category}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteExpense}
                />
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
};

const ExpenseStyled = styled.section`
  /* giữ nguyên style cũ nếu có */
`;

export default Expenses;
