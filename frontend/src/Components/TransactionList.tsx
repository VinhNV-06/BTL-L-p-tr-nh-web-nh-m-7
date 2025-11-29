import React from "react";

interface Transaction {
  date: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

interface Category {
  name: string;
  spent: number;
  limit: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  categoryData: Category[];
  allTransactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categoryData,
  allTransactions,
}) => {
  // Tạo map: { categoryName: true/false }
  const overLimitMap = categoryData.reduce((map, cat) => {
    const spent = allTransactions
      .filter((tx) => tx.category === cat.name)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    map[cat.name] = spent > cat.limit;
    return map;
  }, {} as Record<string, boolean>);

  return (
    <div style={{ marginTop: "3rem" }}>
      <h3>Danh sách giao dịch</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Ngày</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Danh mục</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => {
            const overLimit = overLimitMap[tx.category] || false;

            const displayAmount = `-${Math.abs(tx.amount).toLocaleString()} ₫`;

            const displayStyle: React.CSSProperties = {
              padding: "0.5rem",
              color: overLimit ? "red" : "green",
              fontWeight: 500,
            };

            return (
              <tr key={index}>
                <td style={{ padding: "0.5rem" }}>{tx.date}</td>
                <td style={{ padding: "0.5rem" }}>{tx.category}</td>
                <td style={displayStyle}>{displayAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
