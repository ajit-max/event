// client/src/pages/AdminDashboardPage.jsx - Updated with functional Edit/Delete for Events
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // User info ko localStorage se fetch karo
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Admin data fetch karne ka function
    const fetchAdminData = async () => {
        try {
            // Headers mein token include karo authentication ke liye
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // Sabhi users ko fetch karo
            const usersResponse = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(usersResponse.data);

            // Sabhi events ko fetch karo
            const eventsResponse = await axios.get('http://localhost:5000/api/admin/events', config);
            setEvents(eventsResponse.data);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to load admin data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Agar user logged in nahi hai ya admin nahi hai, toh redirect karo
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/auth'); // Ya koi unauthorized page
            return;
        }

        fetchAdminData();
    }, [userInfo, navigate]); // Dependencies

    // Event Delete Handler
    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
                alert('Event deleted successfully!');
                // Event list ko refresh karo
                setEvents(events.filter((event) => event._id !== eventId));
            } catch (err) {
                console.error('Error deleting event:', err);
                alert(err.response && err.response.data.message ? err.response.data.message : 'Failed to delete event.');
            }
        }
    };

    // Event Edit Handler
const handleEditEvent = (eventId) => {
    navigate(`/create-event?id=${eventId}`); // EventFormPage पर navigate करो with event ID
};

    if (loading) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-white text-xl">Loading Admin Data...</div></div>;
    }

    if (error) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-red-500 text-xl">{error}</div></div>;
    }

    return (
        <div className="page-content-wrapper">
            <div className="admin-panel-container">
                <h1 className="form-title mb-8">Admin Panel</h1>

                <div className="admin-section-card mb-8">
                    <h2 className="text-2xl font-bold text-purple-400 mb-4">All Users ({users.length})</h2>
                    {users.length === 0 ? (
                        <p className="text-gray-400">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td style={{ wordBreak: 'break-all' }}>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button className="btn-primary-small mr-2">Edit</button> {/* User edit functionality will be added later */}
                                                <button className="btn-danger-small">Delete</button> {/* User delete functionality will be added later */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="admin-section-card">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">All Events ({events.length})</h2>
                    {events.length === 0 ? (
                        <p className="text-gray-400">No events found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Organizer</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td>{event.name}</td>
                                            <td>{event.organizerName || event.organizer}</td> {/* Display organizer name if available */}
                                            <td>{new Date(event.date).toLocaleDateString()}</td>
                                            <td>{event.isPublished ? 'Published' : 'Draft'}</td>
                                            <td>
                                                <button onClick={() => handleEditEvent(event._id)} className="btn-primary-small mr-2">Edit</button>
                                                <button onClick={() => handleDeleteEvent(event._id)} className="btn-danger-small">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;