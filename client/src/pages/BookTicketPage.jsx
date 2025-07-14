// client/src/pages/BookTicketPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookTicketPage = () => {
    const { eventId } = useParams(); // URL se event ID milegi
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1); // User kitni tickets chahta hai
    const [selectedTicketType, setSelectedTicketType] = useState(null); // Konsa ticket type select kiya

    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Logged-in user ki info

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}`);
                setEvent(data);
                // Default ticket type select karein agar available hai
                if (data.ticketTypes && data.ticketTypes.length > 0) {
                    setSelectedTicketType(data.ticketTypes[0]);
                } else if (data.price !== undefined) {
                    setSelectedTicketType({ name: 'General', price: data.price, quantity: data.availableTickets });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching event for booking:', err);
                setError('Failed to load event details for booking.');
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    // Calculate total amount
    const totalAmount = selectedTicketType ? (quantity * selectedTicketType.price).toFixed(2) : '0.00';

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        // Abhi ke liye bas alert dikhate hain, payment gateway integration baad mein hoga
        alert(`Booking ${quantity} tickets for ${event.name} (${selectedTicketType?.name}) - Total: $${totalAmount}`);
        // Yahan se payment gateway redirect ya modal open hoga
        alert('Proceeding to payment gateway... (Payment feature coming soon!)');
        // navigate('/payment-success'); // Dummy redirect
    };

    if (loading) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-white text-xl">Loading Booking Details...</div></div>;
    }

    if (error) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-red-500 text-xl">{error}</div></div>;
    }

    if (!event) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-gray-400 text-xl">Event not found for booking.</div></div>;
    }

    return (
        <div className="page-content-wrapper">
            <div className="form-container"> {/* Re-using form-container */}
                <h1 className="form-title mb-6">Book Tickets for {event.name}</h1>

                <div className="mb-4">
                    <p className="text-lg font-semibold mb-2">Event Details:</p>
                    <p className="text-gray-300">Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-300">Location: {event.location}</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {event.ticketTypes && event.ticketTypes.length > 1 && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="ticketType">Select Ticket Type</label>
                            <select id="ticketType" className="form-select"
                                value={selectedTicketType ? selectedTicketType.name : ''}
                                onChange={(e) => setSelectedTicketType(event.ticketTypes.find(t => t.name === e.target.value))}
                                required
                            >
                                {event.ticketTypes.map(type => (
                                    <option key={type.name} value={type.name}>
                                        {type.name} (${type.price.toFixed(2)}) - Available: {type.quantity}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="quantity">Quantity</label>
                        <input type="number" id="quantity" className="form-input"
                            value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                            min="1" max={selectedTicketType ? selectedTicketType.quantity : 1} required
                        />
                    </div>

                    <div className="text-center my-6">
                        <p className="text-2xl font-bold text-green-400">Total: ${totalAmount}</p>
                    </div>

                    <button type="submit" className="btn-primary-large w-full">
                        Proceed to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookTicketPage;