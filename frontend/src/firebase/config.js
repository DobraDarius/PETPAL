import { initializeApp } from "firebase/app";
// !!! Acestea trebuie importate din pachetele specifice !!!
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Cheile preluate din index.html-ul tău
    apiKey: "AIzaSyCY2j3NbAclxiu-7Jt71FCA6uphPvJQt0g",
    authDomain: "petpal-e5d41.firebaseapp.com",
    projectId: "petpal-e5d41",
    storageBucket: "petpal-e5d41.firebasestorage.app",
    messagingSenderId: "601672638286",
    appId: "1:601672638286:web:de02892ed56c339667c81f",
    measurementId: "G-VCXEZ3B2VL"
};

// INITIALIZE FIREBASE APP
const app = initializeApp(firebaseConfig);

// EXPORTĂ OBIECTELE DE SERVICII
export const auth = getAuth(app);
export const db = getFirestore(app);

// Nu ai nevoie să exporti `app` decât dacă e necesar
// Exportăm 'auth' pentru autentificare (folosit în AuthContext)
// Exportăm 'db' pentru Firestore (folosit pentru salvarea rolurilor și chat)