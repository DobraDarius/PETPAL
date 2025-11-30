import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";  // presupun că aici ai logout
import "./ShelterDashboard.css";

const ShelterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");  // redirect la login după logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="shelter-container">
            {/* HEADER */}
            <header className="dashboard-header" style={{ position: "relative" }}>
                <h1 className="title">🏠 Shelter Dashboard</h1>

                {/* Profile Icon + dropdown */}
                <div
                    className="profile-icon-container"
                    style={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
                >
                    <FaUserCircle
                        size={36}
                        onClick={() => setShowMenu(!showMenu)}
                        title={user?.email || "Profile"}
                    />
                    {showMenu && (
                        <div className="profile-dropdown">
                            <p style={{ margin: "8px 12px", fontWeight: "bold" }}>
                                {user?.email}
                            </p>
                            <button className="logout-btn" onClick={handleLogout}>
                                Deconectare
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* ACTION BUTTON */}
            <div className="actions">
                <button
                    className="add-pet-btn"
                    onClick={() => navigate("/shelter/add-pet")}
                >
                    + Add New Pet
                </button>
            </div>

            {/* LISTA DE ANIMALE */}
            <h2 className="section-title">Your Listed Animals</h2>

            <div className="cards-container">
                {/* Card exemplu */}
                <div className="pet-card">
                    <img
                        src="https://place-puppy.com/400x400"
                        className="pet-image"
                        alt="pet"
                    />
                    <div className="pet-info">
                        <h3>Bella</h3>
                        <p>Golden Retriever • 3 years</p>
                        <div className="pet-buttons">
                            <button className="edit-btn">Edit</button>
                            <button className="delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* REQUESTS SECTION */}
            <h2 className="section-title">Adoption Requests</h2>
            <div className="requests-container">
                <div className="request-card">
                    <h3>
                        Request from: <span>John Doe</span>
                    </h3>
                    <p>
                        Interested in adopting: <strong> Bella</strong>
                    </p>
                    <div className="request-buttons">
                        <button className="approve-btn">Approve</button>
                        <button className="reject-btn">Reject</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShelterDashboard;
