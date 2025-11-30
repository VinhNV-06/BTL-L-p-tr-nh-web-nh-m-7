import React, { useState, useMemo } from "react";
import styled from "styled-components";

import bg from "../img/bg.png";
import { MainLayout } from "../styles/Layouts";

import Orb from "../Components/Orb/Orb";
import Navigation from "../Components/Navigation/Navigation";
import Dashboard from "../Components/Dashboard/Dashboard";
import CategoryManager from "./CategoryManager";
import ExpensesManager from "./ExpenseManager";
import MonthlyReport from "./MonthlyReport";
import BudgetManager from "./BudgetManager";

import { useGlobalContext } from "../context/useGlobalContext";

const Home: React.FC = () => {
  const [active, setActive] = useState<number>(1);

  const global = useGlobalContext();
  console.log(global);

  // Hiển thị component theo menu đang chọn
  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 5:
        return <CategoryManager />; 
      case 6:
        return <ExpensesManager />;
      case 7:
        return <MonthlyReport />;
      case 8:
        return <BudgetManager />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <HomeStyled bg={bg}>
      {orbMemo}

      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </HomeStyled>
  );
};

export default Home;

const HomeStyled = styled.div<{ bg: string }>`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;

  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;
