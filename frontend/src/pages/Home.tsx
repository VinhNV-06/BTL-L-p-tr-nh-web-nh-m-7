import React, { useState, useMemo } from "react";
import styled from "styled-components";

import bg from "../img/bg.png";
import { MainLayout } from "../styles/Layouts";

import Orb from "../Components/Orb/Orb";
import Navigation from "../Components/Navigation/Navigation";
import Dashboard from "../Components/Dashboard/Dashboard";
import Income from "../Components/Income/Income";
import Expenses from "../Components/Expenses/Expenses";
import CategoryManager from "./CategoryManager";
import ExpensesManager from "./ExpenseManager";

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
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      case 5:
        return <CategoryManager />; 
      case 6:
        return <ExpensesManager />;
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
  &::-webkit-scrollbar {
      width: 0;
    }
  }
`;
