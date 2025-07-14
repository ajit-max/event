// client/src/pages/DashboardPage.jsx - Corrected Link Path
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        } else {
            setMessage('Please log in to view your dashboard.');
            // Optionally redirect to login page if not logged in
            // navigate('/auth');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        setMessage('You have been logged out.');
        navigate('/'); // Redirect to home page
    };

    if (!userInfo) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-white">
                <p className="text-xl mb-4">{message}</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="btn-primary" /* Reusing primary button class */
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="page-content-wrapper">{/* Updated class name */}
            <div className="form-container"> {/* Re-using form-container for dashboard box */}
                <h1 className="form-title"> {/* Re-using form-title */}
                    {userInfo.role === 'organizer' ? 'Organizer Dashboard' : 'User Dashboard'}
                </h1>
                <p className="text-lg mb-2"><span className="font-bold">Welcome,</span> {userInfo.name}!</p>
                <p className="text-lg mb-4"><span className="font-bold">Email:</span> {userInfo.email}</p>
                <p className="text-lg mb-6"><span className="font-bold">Role:</span> {userInfo.role}</p>

                {userInfo.role === 'organizer' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">My Events</h2>
                        {/* FIX: Link path changed from "/create-event" to "/event-form" */}
                        <Link to="/event-form" className="btn-success">
                            Create New Event
                        </Link>
                        <p className="text-gray-400 mt-4"> (Event listing and management for organizer will go here) </p>
                    </div>
                )}

                {userInfo.role === 'attendee' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">My Booked Tickets</h2>
                        <p className="text-gray-400 mt-4"> (List of your booked tickets will appear here) </p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="btn-danger mt-8" /* Re-using danger button class and top margin */
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;