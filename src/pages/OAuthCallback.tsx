import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); 
      navigate("/home"); 
    } else {
      navigate("/"); 
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default OAuthCallback;
