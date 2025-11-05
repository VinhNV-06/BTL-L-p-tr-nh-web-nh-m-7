import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = "http://localhost:5000/api/v1"; 

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleToggle = () => {
    setErrors({});
    setIsSignUp(!isSignUp);
  };

  const validateRegister = () => {
    const newErrors: { [key: string]: string } = {};
    if (!registerData.name) newErrors.name = "Vui lòng nhập tên đăng nhập";
    if (!registerData.email) newErrors.email = "Vui lòng nhập email";
    if (!registerData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    if (registerData.password !== registerData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    if (!loginData.email) newErrors.email = "Vui lòng nhập email";
    if (!loginData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };

  // ĐĂNG KÝ 
  const handleRegister = async () => {
    const newErrors = validateRegister();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();

      if (res.ok) {
        alert("🎉 Đăng ký thành công!");
        setIsSignUp(false);
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
      } else {
        setErrors({ global: data.message || "Đăng ký thất bại" });
      }
    } catch {
      setErrors({ global: "Lỗi kết nối server" });
    } finally {
      setLoading(false);
    }
  };

  // ĐĂNG NHẬP
  const handleLogin = async () => {
    const newErrors = validateLogin();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        alert("🎉 Đăng nhập thành công!");
        navigate("/home"); 
      } else {
        setErrors({ global: data.message || "Sai email hoặc mật khẩu" });
      }
    } catch {
      setErrors({ global: "Lỗi kết nối server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cont ${isSignUp ? "s-signup" : ""}`}>
      {/* Form ĐĂNG NHẬP */}
      <div className="form sign-in">
        <h2>Đăng nhập</h2>
        {errors.global && <p className="error-text">{errors.global}</p>}
        <label>
          <span>Email</span>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </label>
        <label>
          <span>Mật khẩu</span>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </label>
        <button
          className="submit"
          type="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
        <p className="forgot-pass">Quên mật khẩu?</p>
        <div className="social-media">
          <ul>
            <li>
              <a href={`${API_URL}/facebook`}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" />
              </a>
            </li>
            <li>
              <a href={`${API_URL}/google`}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Form ĐĂNG KÝ */}
      <div className="sub-cont">
        <div className="img">
          <div className="img-text m-up">
            <h2>Lần đầu đến với chúng tôi?</h2>
            <p>Hãy đăng ký ngay để khám phá vô vàn cơ hội tuyệt vời!</p>
          </div>
          <div className="img-text m-in">
            <h2>Bạn đã có tài khoản?</h2>
            <p>Đăng nhập để tiếp tục hành trình nhé!</p>
          </div>
          <div className="img-btn" onClick={handleToggle}>
            <span className="m-up">Đăng ký</span>
            <span className="m-in">Đăng nhập</span>
          </div>
        </div>

        <div className="form sign-up">
          <h2>Đăng ký</h2>
          {errors.global && <p className="error-text">{errors.global}</p>}
          <label>
            <span>Tên đăng nhập</span>
            <input
              type="text"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </label>
          <label>
            <span>Mật khẩu</span>
            <input
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </label>
          <label>
            <span>Xác nhận mật khẩu</span>
            <input
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </label>
          <button
            className="submit"
            type="button"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
