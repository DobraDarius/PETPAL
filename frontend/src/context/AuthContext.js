import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';

// Presupunem că config.js este în folderul 'src/'
// Dacă ai pus config.js în 'src/firebase/config.js', schimbă la '../firebase/config'
import { auth, db } from '../config';

const MOCK_USERS = {
    // Carla este Adopter
    "carla@example.com": { uid: "mock_carla_uid", role: "adopter" },
    // Alice este Owner/Shelter (Am mapat "OWNER" la "shelter" conform select-ului tău)
    "alice@example.com": { uid: "mock_alice_uid", role: "shelter" }
};
const MOCK_PASSWORD = "testlogin";

// 1. Crearea Contextului
const AuthContext = createContext();

// 2. Crearea Provider-ului (Compoenta ce gestionează starea globală)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Funcția de login
    const login = (email, password) => {

        // --- 1. LOGICĂ MOCK (Temporar) ---
        const mockUser = MOCK_USERS[email];
        if (mockUser && password === MOCK_PASSWORD) {
            console.warn("MOCK LOGIN: Logat ca utilizator simulat:", email, "Rol:", mockUser.role);

            // Creăm obiectul utilizator simulat
            const mockAuthUser = {
                email: email,
                uid: mockUser.uid,
                role: mockUser.role
            };

            // Setăm starea în context direct, ocolind Firebase Auth
            setUser(mockAuthUser);
            setLoading(false);

            // Returnăm o promisiune rezolvată pentru a simula succesul Firebase
            return Promise.resolve({ user: mockAuthUser });
        }
        // ------------------------------------

        // --- 2. LOGICĂ REALĂ FIREBASE (Rulată doar dacă nu e user mock) ---
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Funcția de register
    const register = (email, password) => {
        // !!! ATENȚIE: După înregistrare, va trebui să adaugi logică pentru salvarea rolului (Adopter/Shelter) în Firestore, dar o facem mai târziu.
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Funcția de logout
    const logout = () => {
        setUser(null);
        return signOut(auth);
    };

    // Monitorizarea stării de autentificare Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup: Oprește ascultarea când componenta este demontată
        return () => unsubscribe();
    }, []);

    // Obiectul care conține starea și funcțiile disponibile global
    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Afișăm componentele copil (App) doar după ce am terminat de încărcat starea Firebase */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Hook-ul custom pentru utilizare ușoară (importat de App.js și LoginPage.js)
export const useAuth = () => {
    return useContext(AuthContext);
};