import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import AddPetPage from './pages/shelter/AddPetPage';
import EditPetPage from './pages/shelter/EditPetPage';
import PetDetailsPage from './pages/PetDetailsPage';
import InboxPage from './pages/InboxPage';

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>Loading...</div>;
    }

    return (
        <>
            {/*ADD NAVBAR HERE. It will handle its own visibility check (showing nothing if !user) */}
            <Navbar />

            <Routes>
                {!user ? (
                    <Route path="*" element={<LoginPage />} />
                ) : (
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/add-pet" element={<AddPetPage />} />
                        <Route path="/edit-pet/:id" element={<EditPetPage />} />
                        <Route path="/pet/:id" element={<PetDetailsPage />} />
                        <Route path="/inbox" element={<InboxPage />} />
                        <Route path="*" element={<HomePage />} />
                    </>
                )}
            </Routes>
        </>
    );
};

export default App;