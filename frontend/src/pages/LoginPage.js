import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importă funcțiile de autentificare
import RegistrationPage from './RegistrationPage'; // Importă pagina de înregistrare

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Starea pentru a comuta la înregistrare

    // Obține funcția de login din contextul global
    const { login } = useAuth();

    // Dacă utilizatorul apasă pe "Înregistrează-te", afișează componenta RegistrationPage
    if (isRegistering) {
        // Trebuie să-i dăm o modalitate de a se întoarce la Login
        return <RegistrationPage onBackToLogin={() => setIsRegistering(false)} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            // Autentificare reușită! App.js va detecta schimbarea stării și va afișa Dashboard-ul.
        } catch (err) {
            console.error("Login Eșuat:", err);
            // Afișează un mesaj de eroare prietenos
            setError('Autentificare eșuată. Verificați emailul și parola. (Eroare Firebase)');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Autentificare PetPal</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@exemplu.com"
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Parolă:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Parola"
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Loghează-te
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Nu ai cont?
                <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px' }}
                >
                    Înregistrează-te
                </button>
            </p>
        </div>
    );
};

export default LoginPage;