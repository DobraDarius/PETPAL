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
// 1. Crearea Contextului
const AuthContext = createContext();

// 2. Crearea Provider-ului (Compoenta ce gestionează starea globală)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Funcția de login
    const login = (email, password) => {
        // Returnează un Promise
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Funcția de register
    const register = (email, password) => {
        // !!! ATENȚIE: După înregistrare, va trebui să adaugi logică pentru salvarea rolului (Adopter/Shelter) în Firestore, dar o facem mai târziu.
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Funcția de logout
    const logout = () => {
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