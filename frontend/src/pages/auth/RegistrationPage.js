import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './RegistrationPage.css';

const RegistrationPage = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must contain minimum 6 characters!');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await register(email, password);
            const user = userCredential.user;

            // UNIFIED LOGIC: No more specific role selection. Everyone is a 'user'.
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: 'user', // Generic role
                createdAt: new Date()
            });

            console.log("Registration successful!");
            // The AuthContext will pick this up and App.js will redirect
        } catch (err) {
            console.error("Error at registration:", err.message);
            setError('The account couldn\'t be created. Check the credentials first or try later!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-image-section">
                <div className="image-text-content">
                    <h2>Welcome to PetPal</h2>
                    <p>Join our community to adopt a friend or help one find a home.</p>
                </div>
            </div>

            <div className="register-form-section">
                <div className="register-card">
                    <h1 className="register-title">Create an account</h1>
                    <p className="register-subtitle">Start your journey today</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="modern-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="modern-input"
                            />
                            <label className="password-toggle">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Show password
                            </label>
                        </div>

                        {/* REMOVED THE ROLE SELECTION DROPDOWN */}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="login-link">
                        Already have an account?{' '}
                        <span
                            className="link-text"
                            onClick={onBackToLogin}
                            style={{ cursor: 'pointer' }}
                        >
                            Log-in here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;