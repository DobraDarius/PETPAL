import React from 'react';
import { useAuth } from './context/AuthContext'; // Acum importăm din context
import LoginPage from './pages/LoginPage'; // Vom crea acest fișier

const App = () => {
    const { user, loading, logout } = useAuth(); // Obține starea utilizatorului și funcția de logout

    // Ecran de încărcare cât timp Firebase verifică starea
    if (loading) {
        return <div>Se încarcă aplicația PetPal...</div>;
    }

    return (
        <div>
            {/* Logica principală: Dacă user-ul este logat, arată Dashboard. Altfel, arată Login. */}
            {user ? (
                // Dacă ești logat
                <div>
                    <h1>Bine ai venit, {user.email}!</h1>
                    <p>Aici va fi Dashboard-ul cu opțiunile Adopter/Shelter și Chat-ul.</p>
                    <button onClick={logout}>Deconectare</button>
                </div>
            ) : (
                // Dacă nu ești logat, arată pagina de login
                <LoginPage />
            )}
        </div>
    );
};

export default App;