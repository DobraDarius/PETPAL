import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Pentru funcția de înregistrare
import { doc, setDoc } from 'firebase/firestore'; // Pentru salvarea rolului
import { db } from '../config'; // Obiectul Firestore Database

// Acceptăm proprietatea onBackToLogin, necesară pentru a comuta înapoi la pagina de login
const RegistrationPage = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('adopter'); // Rol implicit
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { register } = useAuth(); // Obține funcția de înregistrare din context

    // Funcția CRITICĂ pentru salvarea rolului în Firestore
    const saveUserRole = async (userId, selectedRole) => {
        // Creează un document nou în colecția 'users' cu UID-ul ca cheie
        await setDoc(doc(db, "users", userId), {
            email: email,
            role: selectedRole,
            createdAt: new Date()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // 1. Înregistrează utilizatorul în Firebase Authentication
            const userCredential = await register(email, password);
            const user = userCredential.user;

            // 2. Salvează rolul în Firestore (Aceasta este sarcina ta!)
            await saveUserRole(user.uid, role);

            setMessage("Înregistrare reușită! Vă puteți autentifica acum.");
            // Resetarea formularului și întoarcerea la Login
            setEmail('');
            setPassword('');
            setRole('adopter');

            // După un scurt moment, trece la pagina de Login
            setTimeout(onBackToLogin, 2000);

        } catch (err) {
            console.error("Înregistrare eșuată:", err.message);
            // Afișează un mesaj de eroare prietenos
            if (err.code === 'auth/email-already-in-use') {
                setError('Acest email este deja utilizat. Încercați Login-ul.');
            } else {
                setError('Eroare la înregistrare. Asigurați-vă că parola are minim 6 caractere.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Înregistrare Utilizator</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
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
                        placeholder="Minim 6 caractere"
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Sunt:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    >
                        <option value="adopter">Caut Adopție (Adopter)</option>
                        <option value="shelter">Adăpost (Shelter)</option>
                    </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Înregistrează-te
                </button>
            </form>

            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Ai deja cont?
                <button
                    type="button"
                    onClick={onBackToLogin}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px' }}
                >
                    Înapoi la Login
                </button>
            </p>
        </div>
    );
};

export default RegistrationPage;