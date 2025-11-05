import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // LẤY THÔNG TIN USER 
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/v1/me", { 
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/"); 
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
        localStorage.removeItem("token");
        navigate("/"); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:5000/api/v1/logout", { 
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
      }
    }

    localStorage.removeItem("token");
    navigate("/"); 
  };

  if (loading) return <p>Đang tải thông tin...</p>;

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>Xin chào, {user?.name || "Người dùng"} 👋</h2>
        <button onClick={handleLogout}>Đăng xuất</button>
      </nav>

      <main>
        <h3>Chào mừng bạn đến trang Home!</h3>
        <p>Email của bạn: {user?.email}</p>
      </main>
    </div>
  );
};

export default Home;
