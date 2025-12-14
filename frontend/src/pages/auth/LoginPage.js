import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RegistrationPage from './RegistrationPage';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <--- IMPORT NOU

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // State pentru vizibilitatea parolei
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    if (isRegistering) {
        return <RegistrationPage onBackToLogin={() => setIsRegistering(false)} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
        } catch (err) {
            console.error("Login failed:", err);
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                width: '400px',
                padding: '40px 30px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                textAlign: 'center',
                animation: 'fadeIn 1s ease-in-out'
            }}>
                <h2 style={{ marginBottom: '30px', color: '#333', fontWeight: '700', letterSpacing: '1px' }}>
                    🐾 PetPal Login
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={{
                            padding: '12px 15px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            outline: 'none',
                            fontSize: '16px',
                            transition: '0.3s',
                            width: '100%',
                            boxSizing: 'border-box' // Important ca să nu iasă din chenar
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#764ba2'}
                        onBlur={(e) => e.target.style.borderColor = '#ccc'}
                    />

                    {/* WRAPPER PENTRU PAROLĂ CA SĂ PUNEM ICONIȚA */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            type={showPassword ? "text" : "password"} // AICI E MAGIA (TEXT vs PASSWORD)
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            style={{
                                padding: '12px 45px 12px 15px', // Padding dreapta mai mare ca să nu scriem peste ochi
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                outline: 'none',
                                fontSize: '16px',
                                transition: '0.3s',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#764ba2'}
                            onBlur={(e) => e.target.style.borderColor = '#ccc'}
                        />

                        {/* ICONIȚA OCHI */}
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#764ba2',
                                fontSize: '1.2rem'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: '0.3s',
                            boxShadow: '0 5px 15px rgba(118,75,162,0.4)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Log In
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

                <p style={{ marginTop: '25px', fontSize: '14px', color: '#555' }}>
                    Don’t have an account?
                    <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#764ba2',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginLeft: '5px'
                        }}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;