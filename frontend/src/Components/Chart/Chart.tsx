import React, { FC } from 'react';
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/useGlobalContext';
import { dateFormat } from '../../utils/dateFormat';

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// interface linh hoạt hơn: date có thể là string hoặc Date
interface Transaction {
  date: string | Date;
  amount: number;
}

const Chart: FC = () => {
  const { incomes, expenses } = useGlobalContext() as {
    incomes: Transaction[];
    expenses: Transaction[];
  };

  const data = {
    labels: incomes.map((inc) => dateFormat(inc.date)),
    datasets: [
      {
        label: 'Income',
        data: incomes.map((income) => income.amount),
        backgroundColor: 'green',
        tension: 0.2,
      },
      {
        label: 'Expenses',
        data: expenses.map((expense) => expense.amount),
        backgroundColor: 'red',
        tension: 0.2,
      },
    ],
  };

  return (
    <ChartStyled>
      <Line data={data} />
    </ChartStyled>
  );
};

const ChartStyled = styled.div`
  background: #FCF6F9;   /* giữ nguyên như bản JS */
  border: 2px solid #FFFFFF;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`;

export default Chart;
