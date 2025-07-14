// client/src/pages/EventDetailPage.jsx - Updated with Edit/Delete for Event Creator
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetailPage = () => {
    const { id } = useParams(); // URL se event ID nikalenge
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreator, setIsCreator] = useState(false); // Check if current user is event creator

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(data);
                setLoading(false);

                // Check if current user is the creator
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo && data.organizer === userInfo._id) {
                    setIsCreator(true);
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Event not found or an error occurred.');
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    setError('You must be logged in to delete an event.');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                await axios.delete(`http://localhost:5000/api/events/${id}`, config);
                alert('Event deleted successfully!');
                navigate('/events'); // Event list page par wapas jao
            } catch (err) {
                console.error('Error deleting event:', err);
                setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to delete event.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/event-form?id=${id}`); // EventFormPage पर navigate करो with event ID
    };

    if (loading) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-white text-xl">Loading Event...</div></div>;
    }

    if (error) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-red-500 text-xl">{error}</div></div>;
    }

    if (!event) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-gray-400 text-xl">No event data available.</div></div>;
    }

    return (
        <div className="page-content-wrapper">
            <div className="container py-10">
                <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                    <img src={event.imageUrl || 'https://via.placeholder.com/800x450?text=Event+Image'} alt={event.name} className="event-detail-image" />

                    <h1 className="text-4xl font-bold text-purple-400 mb-4">{event.name}</h1>
                    <p className="text-gray-300 text-lg mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-gray-400 text-sm">Date:</p>
                            <p className="text-white text-lg font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Time:</p>
                            <p className="text-white text-lg font-semibold">{event.time}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Location:</p>
                            <p className="text-white text-lg font-semibold">{event.location}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Organizer:</p>
                            <p className="text-white text-lg font-semibold">{event.organizerName || 'N/A'}</p> {/* Backend se organizer name aayega */}
                        </div>
                    </div>

                    <div className="ticket-info-box">
                        <h2 className="text-2xl font-bold text-green-400 mb-4">Ticket Information</h2>
                        {event.ticketTypes && event.ticketTypes.length > 0 ? (
                            event.ticketTypes.map((ticket, index) => (
                                <div key={index} className="ticket-type-item">
                                    <p className="text-white text-lg">{ticket.type}</p>
                                    <p className="text-green-500 font-bold text-xl">₹{ticket.price}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No ticket information available.</p>
                        )}
                        <button
                            onClick={() => navigate(`/book-ticket/${event._id}`)} // Navigate to booking page
                            className="btn-primary-large mt-6"
                        >
                            Book Your Ticket Now!
                        </button>
                    </div>

                    {isCreator && ( // Sirf event creator ko dikhao
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={handleEdit} className="btn-primary">
                                Edit Event
                            </button>
                            <button onClick={handleDelete} className="btn-danger">
                                Delete Event
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;