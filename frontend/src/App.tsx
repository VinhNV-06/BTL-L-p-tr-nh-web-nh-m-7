import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import CategoryManager from "./pages/CategoryManager";
import ExpenseManager from "./pages/ExpenseManager";
import MonthlyReport from "./pages/MonthlyReport";

// App.tsx
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/categories" element={<CategoryManager />} />
      <Route path="/expenses" element={<ExpenseManager />} />
      <Route path="/monthly-report" element={<MonthlyReport />} />
    </Routes>
  );
};


export default App;
