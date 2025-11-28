import React from 'react';
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

const Navigation: React.FC<NavigationProps> = ({ active, setActive }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("token");
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
                    <h2>Nguyen van A</h2>
                    <p>Your money</p>
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
    padding: 2rem 1.5rem;
    width: 374px;
    height: 83%;
    background: #f3ddebff;
    border: 3px solid #eea9e3ed;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #ffd8f9ff;
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }

        p {
            color: rgba(34, 34, 96, 0.6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-radius: 10px; 
        transition: all 0.25s ease;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            padding: 0.8rem 1rem;
            border-radius: 14px;
            transition: 
                 background 0.25s ease,
                 transform 0.2s ease,
                 color 0.25s ease;
            color: rgba(34, 34, 96, 0.6);
            position: relative;
            

            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: color 0.25s ease;
            }
        }
    .menu-items li:hover {
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(1.06);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 1);
        cursor: pointer;
        }  
    .menu-items li:hover i {
        color: rgba(34, 34, 96, 1);
    }
  
    }

    .active {
        color: rgba(34, 13, 79, 1) !important;
        background: rgba(255, 255, 255, 0.9);
        transform: scale(1.07);
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) inset;

        i {
            color: rgba(34, 34, 96, 1) !important;
        }

        
    }
`;

export default Navigation;
