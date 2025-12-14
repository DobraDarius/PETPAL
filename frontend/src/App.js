import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import AddPetPage from './pages/shelter/AddPetPage';
import LoginPage from './pages/auth/LoginPage';
import AdopterDashboard from './pages/adopter/AdopterDashboard';
import ShelterDashboard from './pages/shelter/ShelterDashboard';
import PetDetailsPage from './pages/PetDetailsPage';
import EditPetPage from './pages/shelter/EditPetPage';
const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>PetPal is loading...</div>;
    }

    return (
        <>
            {!user ? (
                <LoginPage />
            ) : (
                <Routes>
                    {user.role === "adopter" && (
                        <Route path="/" element={<AdopterDashboard />} />
                    )}

                    {user.role === "shelter" && (
                        <>
                            <Route path="/" element={<ShelterDashboard />} />
                            <Route path="/shelter/add-pet" element={<AddPetPage />} />
                            <Route path="/shelter/edit-pet/:id" element={<EditPetPage />} />
                        </>
                    )}

                    <Route path="/pet/:id" element={<PetDetailsPage />} />
                </Routes>
            )}
        </>
    );
};

export default App;