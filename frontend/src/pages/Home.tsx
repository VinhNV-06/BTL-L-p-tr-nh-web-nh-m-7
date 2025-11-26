import React, { useState, useMemo } from "react";
import styled from "styled-components";

import bg from "../img/bg.png";
import { MainLayout } from "../styles/Layouts";

import Orb from "../Components/Orb/Orb";
import Navigation from "../Components/Navigation/Navigation";
import Dashboard from "../Components/Dashboard/Dashboard";
import Income from "../Components/Income/Income";
import Expenses from "../Components/Expenses/Expenses";

import { useGlobalContext } from "../context/useGlobalContext";

const Home: React.FC = () => {
  const [active, setActive] = useState<number>(1);

  const global = useGlobalContext();
  console.log(global);

  // Không khai báo JSX.Element nữa
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
