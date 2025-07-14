// client/src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap'; // For hover animations

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    // Event details page par navigate karega click karne par
    const handleCardClick = () => {
        navigate(`/events/${event._id}`);
    };

    // Card par mouse enter hone par animation
    const handleMouseEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -5, // Lift up
            scale: 1.02, // Slightly enlarge
            rotationX: 2, // Subtle X-axis rotation
            rotationY: 2, // Subtle Y-axis rotation
            boxShadow: '0px 10px 20px rgba(0,0,0,0.4)', // Deeper shadow
            duration: 0.3,
            ease: 'power2.out',
            perspective: '1000px', // Creates a 3D space for transforms
        });
    };

    // Card se mouse leave hone par animation
    const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', // Original shadow
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    return (
        <div
            className="event-card" /* Updated class name */
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformOrigin: 'center center',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
            }}
        >
            <img src={event.imageUrl} alt={event.name} className="event-card-image" /> {/* Updated class name */}
            <div className="event-card-content"> {/* Updated class name */}
                <h3 className="event-card-title">{event.name}</h3> {/* Updated class name */}
                <p className="event-card-info">{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> {/* Updated class name */}
                <p className="event-card-info">{event.location}</p> {/* Updated class name */}
                <div className="event-card-price-ticket"> {/* Updated class name */}
                    <span className="event-card-price"> {/* Updated class name */}
                        {event.price === 0 ? 'FREE' : `$${event.price.toFixed(2)}`}
                    </span>
                    <span className="event-card-tickets-left"> {/* Updated class name */}
                        Tickets Left: {event.availableTickets}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EventCard;