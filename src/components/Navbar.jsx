// client/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Elevate Events
                </Link>
                <div className="navbar-links">
                    <Link to="/events" className="navbar-link">
                        Events
                    </Link>
                    <Link to="/auth" className="navbar-link">
                        Login/Register
                    </Link>
                    <Link to="/dashboard" className="navbar-button">
                        Dashboard
                    </Link>
                    {/* Admin Link - Temporary for easy access during development */}
                    <Link to="/admin" className="navbar-button" style={{ marginLeft: '1rem' }}>
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;