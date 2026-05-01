import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clearAuthSession } from '../utils/api';

function Sidebar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("userData") || localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUsername(user.username || user.name || "");
            } catch (err) {
                console.error("Error parsing user data:", err);
            }
        }
    }, []);

    const menu = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        { path: '/products', label: 'Produk', icon: 'fas fa-box' },
        { path: '/transaction', label: 'Transaksi', icon: 'fas fa-shopping-cart' },
        { path: '/bi-analytics', label: 'Analitik Bisnis', icon: 'fas fa-chart-bar' },
        { path: '/smart-predict', label: 'Fitur Pintar', icon: 'fas fa-robot' },
    ];

    const handleLogout = () => {
        clearAuthSession();
        navigate('/login');
    };

    return (
        <aside className="sidebar d-flex flex-column justify-content-between pb-4">
            <div>
                <div className="logo px-2">
                    <i className="fas fa-layer-group"/><span>Prospera</span>
                </div>

                {username && (
                    <div className="px-3 mb-4 text-center">
                        <small className="d-block text-white-50">Selamat datang,</small>
                        <div className="fw-bold text-white h6 mb-0">Hi, {username}!</div>
                    </div>
                )}

                <ul className="nav flex-column">
                    {menu.map((item) => (
                        <li className="nav-item" key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className={item.icon} />
                                <span className="nav-text">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="px-3">
                <button 
                    onClick={handleLogout}
                    className="nav-link w-100 border-0 bg-transparent text-start"
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fas fa-sign-out-alt" />
                    <span className="nav-text">Keluar</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
