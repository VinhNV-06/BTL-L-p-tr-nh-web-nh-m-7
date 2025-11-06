import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
    </Routes>
  );
};

export default App;
