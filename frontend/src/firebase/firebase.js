// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCY2j3NbAclxiu-7Jt71FCA6uphPvJQt0g",
    authDomain: "petpal-e5d41.firebaseapp.com",
    projectId: "petpal-e5d41",
    storageBucket: "petpal-e5d41.firebasestorage.app",
    messagingSenderId: "601672638286",
    appId: "1:601672638286:web:de02892ed56c339667c81f",
    measurementId: "G-VCXEZ3B2VL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export them for use in other components
export { auth, db, storage };