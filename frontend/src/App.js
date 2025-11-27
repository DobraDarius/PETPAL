import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

// 1. Importă Dashboard-urile nou create
import AdopterDashboard from './pages/AdopterDashboard';
import ShelterDashboard from './pages/ShelterDashboard';

const App = () => {
    // Obține user, loading și logout din context
    const { user, loading, logout } = useAuth();

    // Ecran de încărcare
    if (loading) {
        return <div>Se încarcă aplicația PetPal...</div>;
    }

    // 2. Logica principală de Rutare
    return (
        <div style={{ padding: '20px' }}>
            {/* Dacă user-ul este logat */}
            {user ? (
                <div>
                    <h1>Bine ai venit, {user.email}!</h1>

                    {/* AICI ESTE LOGICA DE RUTARE PE BAZA ROLULUI */}
                    {user.role === 'adopter' ? (
                        <AdopterDashboard />
                    ) : user.role === 'shelter' ? (
                        <ShelterDashboard />
                    ) : (
                        // Cazul în care rolul nu este setat (deși nu ar trebui să se întâmple cu mock data)
                        <p>Eroare: Rol utilizator necunoscut.</p>
                    )}

                    {/* Butonul de deconectare, funcțional în ambele cazuri */}
                    <button
                        onClick={logout}
                        style={{ marginTop: '20px', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Deconectare
                    </button>
                </div>
            ) : (
                // Dacă nu ești logat, arată pagina de login
                <LoginPage />
            )}
        </div>
    );
};

export default App;