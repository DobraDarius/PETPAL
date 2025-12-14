import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import AddPetPage from './pages/shelter/AddPetPage';
// Pagini
import LoginPage from './pages/auth/LoginPage';
import AdopterDashboard from './pages/adopter/AdopterDashboard';
import ShelterDashboard from './pages/shelter/ShelterDashboard';
import PetDetailsPage from './pages/PetDetailsPage';

const App = () => {
    const { user, loading, logout } = useAuth();
    console.log("User curent:", user);
    if (loading) {
        return <div>PetPal is loading...</div>;
    }

    return (
        <>
            {/* Dacă nu ești logat, la orice route, întoarce LoginPage */}
            {!user ? (
                <LoginPage />
            ) : (
                <>
                    <h1>Welcome, {user.email}!</h1>

                    <button
                        onClick={logout}
                        style={{
                            marginBottom: "15px",
                            padding: "10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Deconnect
                    </button>

                    <Routes>
                        {user.role === "adopter" && (
                            <Route path="/" element={<AdopterDashboard />} />
                        )}

                        {user.role === "shelter" && (
                            <>
                                <Route path="/" element={<ShelterDashboard />} />
                                <Route path="/shelter/add-pet" element={<AddPetPage />} />
                            </>
                        )}

                        {/* Pagina detalii pet */}
                        <Route path="/pet/:id" element={<PetDetailsPage />} />
                    </Routes>
                </>
            )}
        </>
    );
};

export default App;
