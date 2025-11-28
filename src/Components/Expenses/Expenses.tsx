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
  display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;

export default Expenses;
