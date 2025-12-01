import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import { logout } from '../../api/auth';
import { useNavigate } from "react-router-dom";

interface NavigationProps {
    active: number;
    setActive: (id: number) => void;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

const Navigation: React.FC<NavigationProps> = ({ active, setActive }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5000/api/v1/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <NavStyled>
            {/* User Info */}
            <div className="user-con">
                <img src={avatar} alt="Avatar" />
                <div className="text">
                    <h2>{user ? user.name : "Khách"}</h2>
                    <p>{user ? user.email : ""}</p>
                </div>
            </div>

            {/* Menu Items */}
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>

            {/* Sign Out */}
            <div className="bottom-nav">
                <li onClick={handleLogout}>
                    {signout} Đăng xuất
                </li>
            </div>
        </NavStyled>
    );
};

const NavStyled = styled.nav`
    padding: 2.5rem 2rem 5rem 2rem; /* Tăng padding để rộng rãi hơn */
    width: 374px;
<<<<<<< HEAD
    height: 84%;
    background: rgba(252, 246, 249, 0.78);
=======
    height: 100%;
    box-sizing: border-box;
    /* THAY ĐỔI MÀU NỀN & HIỆU ỨNG TỔNG THỂ */
    background: #FFFFFF; /* Đổi nền sang màu trắng tinh */
>>>>>>> main
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08); /* Thêm bóng đổ nhẹ để nổi bật */
    
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 3rem; /* Tăng khoảng cách giữa các khối */

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1.5rem; /* Tăng khoảng cách avatar và text */

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #F8F8F8;
            border: 2px solid #FFFFFF;
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.08);
        }

        h2 {
            /* Tăng kích thước và làm đậm tên người dùng */
            font-size: 1.6rem; 
            color: #222260; 
            font-weight: 700;
            margin-bottom: 0.2rem;
        }

        p {
            /* Giữ màu chữ nhẹ nhàng hơn */
            color: rgba(34, 34, 96, 0.6);
            font-size: 1rem;
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.4rem 0; /* Giảm margin dọc để các mục gần nhau hơn */
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease-in-out; /* Giảm thời gian transition để nhanh hơn */
            color: rgba(34, 34, 96, 0.8); /* Chữ hơi đậm hơn */
            padding: 0.8rem 1rem; /* Thêm padding cho vùng bấm/hover */
            border-radius: 12px; /* Bo góc cho từng mục */
            position: relative;

            i {
                color: rgba(34, 34, 96, 0.8);
                font-size: 1.5rem;
                transition: all 0.3s ease-in-out;
            }
            
            /* Hiệu ứng RÊ CHUỘT (Hover) */
            &:hover {
                background: rgba(245, 245, 245, 0.8); /* Màu nền xám nhạt */
                color: #222260; /* Màu chữ đậm */
                i {
                    color: #222260; 
                }
            }
        }
    }

    .active {
        color: #D946EF !important; /* Đổi màu chữ active thành màu nổi bật (Tím/Hồng) */
        background: rgba(217, 70, 239, 0.1); /* Thêm màu nền nhạt cho active */
        font-weight: 600;

        i {
            color: #D946EF !important;
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 5px; /* Tăng độ dày dải active */
            height: 100%;
            background: #D946EF; /* Đổi màu dải active */
            border-radius: 0 10px 10px 0;
        }
    }
    
    .bottom-nav {
        margin-top: auto;
        li {
            display: flex;
            align-items: center;
            padding: 0.8rem 1rem;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            color: rgba(255, 0, 0, 0.7); /* Màu chữ Đăng xuất */
            font-weight: 600;
            border-radius: 12px;
            
            
            i {
                margin-right: 0.8rem;
                font-size: 1.5rem;
            }

            &:hover {
                background: rgba(255, 0, 0, 0.1); /* Nền đỏ nhạt khi hover */
                color: red;
            }
        }
    }
`;

export default Navigation;
