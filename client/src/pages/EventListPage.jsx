// client/src/pages/EventListPage.jsx
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard'; // EventCard component import kiya
import axios from 'axios'; // API calls ke liye

const EventListPage = () => {
    const [events, setEvents] = useState([]); // Events store karne ke liye state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Backend API call. Backend chal raha hai na port 5000 par?
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-white text-xl">Loading Events...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 text-xl">{error}</div>;
    }

    return (
        <div className="container py-8"> {/* Updated class name */}
            <h1 className="text-3xl font-bold text-center mb-8">All Events</h1> {/* Updated class name */}
            {events.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No events found. Check back later!</p>
            ) : (
                <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-8"> {/* Updated class names */}
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventListPage;