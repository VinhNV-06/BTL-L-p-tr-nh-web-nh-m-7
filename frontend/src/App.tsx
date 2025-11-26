import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";

import { GlobalProvider } from "./context/globalContext";

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
      </Routes>
    </GlobalProvider>
  );
};

export default App;
