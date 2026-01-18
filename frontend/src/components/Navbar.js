import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// ✅ Import the icons now
import { FaPaw, FaPlus, FaEnvelope, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    // Optional: Hide navbar on login/signup pages if you want
    if (!user) return null;

    return (
        <nav className="navbar">
            {/* Logo Area */}
            <Link to="/" className="logo">
                <FaPaw className="logo-icon" /> PetPal
            </Link>

            <div className="nav-links">
                {/* Links for Logged In Users */}
                {user ? (
                    <>
                        <Link to="/" className="nav-link">
                            Find Pets
                        </Link>

                        <Link to="/add-pet" className="nav-link">
                            <FaPlus /> Add Pet
                        </Link>

                        <Link to="/inbox" className="nav-link">
                            <FaEnvelope /> Messages
                        </Link>

                        <button onClick={handleLogout} className="logout-btn">
                            <FaSignOutAlt /> Logout
                        </button>
                    </>
                ) : (
                    /* Links for Visitors */
                    <>
                        <Link to="/login" className="nav-link">
                            <FaSignInAlt /> Login
                        </Link>
                        <Link to="/signup" className="nav-link">
                            <FaUserPlus /> Signup
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;