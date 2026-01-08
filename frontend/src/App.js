import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage'; // The new unified page
import AddPetPage from './pages/shelter/AddPetPage'; // Reuse existing file
import EditPetPage from './pages/shelter/EditPetPage'; // Reuse existing file
import PetDetailsPage from './pages/PetDetailsPage';

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>Loading PetPal...</div>;
    }

    return (
        <Routes>
            {/* If NOT logged in, show Login. If logged in, show HomePage */}
            {!user ? (
                <Route path="*" element={<LoginPage />} />
            ) : (
                <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add-pet" element={<AddPetPage />} />
                    <Route path="/edit-pet/:id" element={<EditPetPage />} />
                    <Route path="/pet/:id" element={<PetDetailsPage />} />
                    {/* Redirect unknown routes to home */}
                    <Route path="*" element={<HomePage />} />
                </>
            )}
        </Routes>
    );
};

export default App;