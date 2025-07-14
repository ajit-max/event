// client/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('attendee');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            let response;
            if (isLogin) {
                response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                setMessage('Login successful!');
            } else {
                response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
                setMessage('Registration successful! Please log in.');
            }
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            navigate('/dashboard'); // Redirect to dashboard after login/registration
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : 'An error occurred.');
        }
    };

    return (
       <div className="page-content-wrapper"> {/* Central alignment */}
           <div className="form-container"> {/* Main form container class */}
                <h2 className="form-title">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {message && <p className="form-message-success">{message}</p>}
                {error && <p className="form-message-error">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="role">
                                Register as
                            </label>
                            <select
                                id="role"
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="attendee">Attendee</option>
                                <option value="organizer">Organizer</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn-primary w-full mt-4" /* Full width and top margin */
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p className="auth-toggle-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="auth-toggle-button"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;