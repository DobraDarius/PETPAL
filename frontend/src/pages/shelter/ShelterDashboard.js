import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlus, FaTrash, FaPen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./ShelterDashboard.css";

const ShelterDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. CITIREA DATELOR DIN FIREBASE (REAL-TIME)
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "pets"), where("ownerId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const petsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPets(petsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. LOGOUT
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // 3. DELETE PET
    const handleDelete = async (petId) => {
        if (window.confirm("Are you sure you want to delete this pet? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "pets", petId));
            } catch (err) {
                console.error("Error deleting pet:", err);
            }
        }
    };

    return (
        <div className="shelter-container">
            {/* HEADER MODERN */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="title">🏠 Shelter Dashboard</h1>
                    <p className="subtitle">Manage your listed pets and adoption requests</p>
                </div>

                {/* Buton Profil & Logout */}
                <div className="profile-section">
                    <div
                        className="profile-trigger"
                        onClick={() => setShowMenu(!showMenu)}
                        title="Click to see profile"
                    >
                        {/* AM SCOS EMAILUL DE AICI, A RĂMAS DOAR ICONIȚA */}
                        <FaUserCircle size={40} color="#4a5568" />
                    </div>

                    {showMenu && (
                        <div className="profile-dropdown">
                            {/* AM MUTAT EMAILUL AICI, ÎN INTERIORUL MENIULUI */}
                            <div style={{
                                padding: '15px',
                                borderBottom: '1px solid #eee',
                                color: '#555',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                {user?.email}
                            </div>

                            <button className="logout-btn" onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* ACTION BAR */}
            <div className="actions-bar">
                <button className="add-pet-btn" onClick={() => navigate("/shelter/add-pet")}>
                    <FaPlus style={{ marginRight: "8px" }} /> Add a New Animal
                </button>
            </div>

            {/* LISTA ANIMALE */}
            <h2 className="section-title">Your Listed Animals ({pets.length})</h2>

            {loading ? (
                <p>Loading your list...</p>
            ) : pets.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't added an animal yet.</p>
                </div>
            ) : (
                <div className="cards-container">
                    {pets.map((pet) => (
                        <div key={pet.id} className="pet-card">
                            <img
                                src={pet.image}
                                alt={pet.name}
                                className="pet-image"
                                onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}}
                            />
                            <div className="pet-info">
                                <h3>{pet.name}</h3>
                                <p className="pet-details">
                                    {pet.type} • {pet.breed} • {pet.age}
                                </p>
                                <div className="pet-buttons">
                                    <button className="icon-btn edit"
                                            title="Edit"
                                            onClick={() => navigate(`/shelter/edit-pet/${pet.id}`)}
                                    >
                                        <FaPen />
                                    </button>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() => handleDelete(pet.id)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShelterDashboard;