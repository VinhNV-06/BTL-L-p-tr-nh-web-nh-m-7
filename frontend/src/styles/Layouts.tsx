
import styled from "styled-components";

export const MainLayout = styled.div`
  padding: 2rem;
  height: 100%;
  display: flex;
  gap: 2rem;

  /* CHỈNH SỬA QUAN TRỌNG: Box Model */
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; 
`;

export const InnerLayout = styled.div`
  padding: 2rem 1.5rem;
  /* Đảm bảo InnerLayout chiếm hết không gian còn lại */
  flex: 1;
  overflow-x: hidden;
`;