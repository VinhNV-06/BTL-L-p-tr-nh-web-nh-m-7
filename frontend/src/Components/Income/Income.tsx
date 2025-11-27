import React, { useEffect, FC } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/useGlobalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem';
import Form from '../Form/Form';   // 👈 form nhập thu nhập đã tách riêng
import { Transaction } from '../../context/types';

const Income: FC = () => {
  const {
    incomes,
    getIncomes,
    deleteIncome,
    totalIncome,
  } = useGlobalContext() as {
    incomes: Transaction[];
    getIncomes: () => Promise<void>;
    deleteIncome: (id: string) => Promise<void>;
    totalIncome: () => number;
  };

  useEffect(() => {
    getIncomes();
  }, []);

  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Incomes</h1>
        <h2 className="total-income">
          Total Income: <span>${totalIncome()}</span>
        </h2>
        <div className="income-content">
          <div className="form-container">
            <Form /> {/* 👈 form nhập thu nhập */}
          </div>
          <div className="incomes">
            {incomes.map((income) => {
              const {
                _id = '',
                title = '',
                amount = 0,
                date = '',
                category = '',
                description = '',
                type = 'income',
              } = income;

              return (
                <IncomeItem
                  key={_id}
                  id={_id}
                  title={title}
                  description={description}
                  amount={amount}
                  date={date}
                  type={type}
                  category={category}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteIncome}
                />
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  );
};

const IncomeStyled = styled.div`
  display: flex;
  overflow: auto;

  .total-income {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: 0.5rem;

    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }

  .income-content {
    display: flex;
    gap: 2rem;

    .incomes {
      flex: 1;
    }
  }
`;

export default Income;
