import React from "react";
import { YearlyStats } from "../../api/statsApi";

interface Props {
  stats: YearlyStats;
}

const AlertBox: React.FC<Props> = ({ stats }) => {
  const { months } = stats;
  const monthsOver = months.filter((m) => m.over > 0);
  const countOver = monthsOver.length;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        background: "#fff3cd", // vàng nhạt cảnh báo
        border: "1px solid #ffeeba",
        borderRadius: "8px",
      }}
    >
      <strong>⚠️ Cảnh báo:</strong>
      <p>
        Bạn đã vượt định mức ở {countOver}/{months.length} tháng
      </p>
      {monthsOver.map((m) => (
        <p key={m.month}>
          Tháng {m.month} chi tiêu vượt{" "}
          {m.over.toLocaleString("vi-VN")} ₫ so với định mức
        </p>
      ))}
    </div>
  );
};

export default AlertBox;
