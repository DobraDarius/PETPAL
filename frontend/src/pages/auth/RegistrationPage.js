import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Pentru funcția de înregistrare
import { doc, setDoc } from 'firebase/firestore'; // Pentru salvarea rolului în baza de date
import { db } from '../../firebase/config'; // Obiectul Firestore Database

// Acceptăm proprietatea onBackToLogin, necesară pentru a comuta înapoi la pagina de login
const RegistrationPage = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('adopter'); // Rol implicit
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Starea pentru a afișa/ascunde parola
    const [showPassword, setShowPassword] = useState(false);

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

            // 2. Salvează rolul în Firestore
            await saveUserRole(user.uid, role);

            setMessage("Înregistrare reușită! Vă puteți autentifica acum.");

            // Resetarea formularului și întoarcerea la Login
            setEmail('');
            setPassword('');
            setRole('adopter');

            // După un scurt moment, trece la pagina de Login
            setTimeout(onBackToLogin, 2000);

        } catch (err) { // Am folosit 'err' aici pentru a rezolva eroarea 'is not defined'
            console.error("Cod de eroare Firebase:", err.code);

            let errorMessage = 'Eroare necunoscută la înregistrare. Vă rugăm să încercați din nou.';

            // Tratarea detaliată a erorilor Firebase
            switch (err.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Acest email este deja utilizat. Încercați Login-ul.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Parola este prea slabă. Trebuie să aibă minim 6 caractere.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Adresa de email este invalidă. Verificați formatul.';
                    break;
                default:
                    // Afișează mesajul de eroare specific Firebase (ex: eroare de rețea)
                    errorMessage = err.message || errorMessage;
                    break;
            }

            setError(errorMessage);
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
                        // Schimbăm tipul în funcție de starea showPassword
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minim 6 caractere"
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                    <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)} // Comută starea
                        />
                        <label htmlFor="showPassword" style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '5px' }}>
                            {showPassword ? 'Ascunde Parola' : 'Afișează Parola'}
                        </label>
                    </div>
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