import React from "react";
import styled from "styled-components";
import { dateFormat } from "../../utils/dateFormat";

interface Transaction {
  _id?: string;
  date: string;
  category: { _id?: string; name: string };
  amount: number;
  month: number;
  year: number;
}

interface CategoryData {
  name: string;
  spent: number;
  limit: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  categoryData: CategoryData[];
  allTransactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categoryData,
  allTransactions,
}) => {
  const overLimitMap: Record<string, boolean> = categoryData.reduce((map, cat) => {
    const spent = allTransactions
      .filter((tx) => tx.category?.name === cat.name)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    map[cat.name] = spent > cat.limit;
    return map;
  }, {} as Record<string, boolean>);

  return (
    <Wrapper>
      <h3>Danh sách giao dịch</h3>
      <StyledTable>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Danh mục</th>
            <th>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const categoryName = tx.category?.name || "Khác";
            const overLimit = overLimitMap[categoryName] || false;
            const displayAmount = `-${Math.abs(tx.amount).toLocaleString("vi-VN")} ₫`;

            return (
              <tr key={tx._id || `${tx.date}-${tx.amount}`}>
                <td>{dateFormat(tx.date)}</td>
                <td>{categoryName}</td>
                <td className={overLimit ? "over" : "ok"}>{displayAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
};

export default TransactionList;

const Wrapper = styled.div`
  margin-top: 3rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);

  th, td {
    padding: 0.8rem 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 0.95rem;
  }

  th {
    background: #f5f5f5;
    font-weight: 600;
    color: #444;
  }

  tr:hover {
    background: #fafafa;
  }

  td.ok {
    color: #2e7d32; /* xanh */
    font-weight: 600;
  }

  td.over {
    color: #d32f2f; /* đỏ */
    font-weight: 600;
  }
`;
