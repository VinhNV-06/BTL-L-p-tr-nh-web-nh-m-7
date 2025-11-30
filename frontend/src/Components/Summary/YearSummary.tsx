import React from "react";
import { YearlyStats } from "../../api/statsApi";

interface Props {
  stats: YearlyStats;
}

const YearSummary: React.FC<Props> = ({ stats }) => {
  const { totals, months } = stats;
  const monthsOver = months.filter((m) => m.over > 0).length;
  const percentOver = Math.round((monthsOver / months.length) * 100);

  // ✅ Tạo một component nhỏ cho card để tái sử dụng
  const SummaryCard: React.FC<{ title: string; value: string; color?: string }> = ({
    title,
    value,
    color = "inherit",
  }) => (
    <div
      style={{
        flex: 1,
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ color, fontWeight: "bold", fontSize: "1.2em" }}>{value}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <SummaryCard
        title="Tổng chi tiêu"
        value={totals.spent.toLocaleString("vi-VN") + " ₫"}
      />
      <SummaryCard
        title="Tổng định mức"
        value={totals.budget.toLocaleString("vi-VN") + " ₫"}
      />
      <SummaryCard
        title="Tổng vượt định mức"
        value={totals.over.toLocaleString("vi-VN") + " ₫"}
        color="red"
      />
      <SummaryCard
        title="Tỷ lệ vượt định mức"
        value={`${monthsOver}/${months.length} tháng (${percentOver}%)`}
        color={percentOver > 50 ? "red" : "green"} // ✅ nếu vượt nhiều thì đỏ, ít thì xanh
      />
    </div>
  );
};

export default YearSummary;
