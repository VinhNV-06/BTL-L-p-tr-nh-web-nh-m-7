import React from "react";
import { YearlyStats } from "../../api/statsApi";
import styled from "styled-components";

interface Props {
  stats: YearlyStats;
}

const AlertBox: React.FC<Props> = ({ stats }) => {
  const { months } = stats;
  const monthsOver = months.filter((m) => m.over > 0);
  const countOver = monthsOver.length;

  return (
    <AlertWrapper>
      <AlertHeader>⚠️ Cảnh báo</AlertHeader>
      <AlertText>
        Bạn đã vượt định mức ở <strong>{countOver}/{months.length}</strong> tháng
      </AlertText>
      <AlertList>
        {monthsOver.map((m) => (
          <li key={m.month}>
            <span>Tháng {m.month}</span> — vượt{" "}
            <strong>{m.over.toLocaleString("vi-VN")} ₫</strong>
          </li>
        ))}
      </AlertList>
    </AlertWrapper>
  );
};

export default AlertBox;

// ✅ Styled-components
const AlertWrapper = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fff8e1; /* vàng nhạt */
  border: 1px solid #ffecb3;
  border-left: 6px solid #fbc02d; /* viền vàng đậm bên trái */
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
`;

const AlertHeader = styled.h4`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e65100; /* cam đậm */
`;

const AlertText = styled.p`
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #5d4037;
`;

const AlertList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 0.95rem;
  color: #6d4c41;

  li {
    margin-bottom: 6px;
  }

  strong {
    color: #ff1313ff; /* đỏ cho số tiền vượt */
  }
`;
