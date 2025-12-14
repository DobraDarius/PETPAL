// Importa Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCY2j3NbAclxiu-7Jt71FCA6uphPvJQt0g",
    authDomain: "petpal-e5d41.firebaseapp.com",
    projectId: "petpal-e5d41",
    storageBucket: "petpal-e5d41.firebasestorage.app",
    messagingSenderId: "601672638286",
    appId: "1:601672638286:web:de02892ed56c339667c81f",
    measurementId: "G-VCXEZ3B2VL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
