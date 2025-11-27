// Fișier: src/index.js (Versiunea Corectată)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importă noul App.js
import { AuthProvider } from './context/AuthContext'; // Importă Provider-ul

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);