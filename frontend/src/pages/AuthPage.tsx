import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api/v1";

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Cập nhật dữ liệu nhập
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSignUp ? "register" : "login";
    const payload = isSignUp
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi không xác định");

      alert(isSignUp ? "Đăng ký thành công!" : "Đăng nhập thành công!");
      console.log("Kết quả:", data);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleForm = () => setIsSignUp(!isSignUp);

  return (
    <div className={`cont ${isSignUp ? "s-signup" : ""}`}>
      <div className="form sign-in">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>Mật khẩu</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="submit" type="submit">
            Đăng nhập
          </button>
        </form>

        <p className="forgot-pass">Quên mật khẩu?</p>
        <div className="social-media">
          <ul>
            <li>
              <a href={`${API_BASE}/facebook`}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" />
              </a>
            </li>
            <li>
              <a href={`${API_BASE}/google`}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sub-cont">
        <div className="img">
          <div className="img-text m-up">
            <h2>Lần đầu đến với chúng tôi?</h2>
            <p>Hãy đăng ký ngay để khám phá vô vàn cơ hội tuyệt vời!</p>
          </div>
          <div className="img-text m-in">
            <h2>Thành viên thân quen?</h2>
            <p>Đăng nhập để tiếp tục hành trình của bạn!</p>
          </div>
          <div className="img-btn" onClick={toggleForm}>
            <span className="m-up">Đăng ký</span>
            <span className="m-in">Đăng nhập</span>
          </div>
        </div>

        <div className="form sign-up">
          <h2>Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Tên đăng nhập</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Mật khẩu</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Xác nhận mật khẩu</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            <button className="submit" type="submit">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
