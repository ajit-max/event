// client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">&copy; {new Date().getFullYear()} Elevate Events. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;