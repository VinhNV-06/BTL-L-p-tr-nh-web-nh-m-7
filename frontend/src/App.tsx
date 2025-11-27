import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import CategoryManager from "./pages/CategoryManager";

// App.tsx
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/categories" element={<CategoryManager />} />
    </Routes>
  );
};


export default App;
