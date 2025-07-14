// client/src/pages/EventFormPage.jsx - FINAL WORKAROUND: Inputs Fully Uncontrolled with useRef - FULLY FIXED
// This version completely bypasses React's controlled components for input values.
// It uses useRef for both initial pre-filling AND for reading/updating values.
// This is the most robust solution for the unique typing/refresh issue encountered.

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EventFormPage = () => {
    // Message and Error states for user feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Edit mode flags
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventId, setEventId] = useState(null);

    // Page loading state for initial data fetch
    const [pageLoading, setPageLoading] = useState(true);

    // React Router hooks
    const navigate = useNavigate();
    const routerLocation = useLocation();

    // User info from localStorage for authorization
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Refs for direct DOM manipulation of input values (UNCONTROLLED COMPONENTS)
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const dateRef = useRef(null);
    const eventLocationRef = useRef(null);
    const categoryRef = useRef(null);
    const imageUrlRef = useRef(null);
    const priceRef = useRef(null);
    const availableTicketsRef = useRef(null);
    const isPublishedRef = useRef(null);

    // useEffect hook: Handles Authorization, Edit Mode detection, and Data Fetching
    useEffect(() => {
        console.log("FINAL_UNCONTROLLED_FIX_DEBUG: useEffect started.");
        setPageLoading(true); // Start loading state

        // 1. Authorization Check: Redirect if user is not authorized
        if (!userInfo || (userInfo.role !== 'organizer' && userInfo.role !== 'admin')) {
            console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Unauthorized user. Redirecting to /auth");
            navigate('/auth');
            return; // Exit useEffect if not authorized
        }
        console.log("FINAL_UNCONTROLLED_FIX_DEBUG: User is authorized:", userInfo.name, userInfo.role);

        // 2. Check for Edit Mode: Extract event ID from URL query parameters
        const queryParams = new URLSearchParams(routerLocation.search);
        const idFromUrl = queryParams.get('id');
        console.log("FINAL_UNCONTROLLED_FIX_DEBUG: ID from URL:", idFromUrl);

        if (idFromUrl) {
            // If ID found, enter Edit Mode
            setIsEditMode(true);
            setEventId(idFromUrl);
            console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Entering Edit Mode for ID:", idFromUrl);

            // Fetch existing event data to pre-fill the form
            const fetchEventToEdit = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Fetching event data for edit:", idFromUrl);
                    const { data } = await axios.get(`http://localhost:5000/api/events/${idFromUrl}`, config);
                    console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Event data fetched (raw):", data);

                    // 4. Populate form fields using Refs DIRECTLY (UNCONTROLLED WORKAROUND)
                    // These values bypass React's state for initial fill, directly updating DOM
                    if (nameRef.current) nameRef.current.value = data.name || '';
                    if (descriptionRef.current) descriptionRef.current.value = data.description || '';

                    let formattedDate = '';
                    if (data.date) {
                        try {
                            const eventDateObj = new Date(data.date);
                            // Ensure valid date and format for datetime-local
                            if (!isNaN(eventDateObj.getTime())) {
                                formattedDate = eventDateObj.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
                            } else {
                                console.warn("FINAL_UNCONTROLLED_FIX_DEBUG: Invalid date received:", data.date);
                            }
                        } catch (dateError) { console.error("FINAL_UNCONTROLLED_FIX_DEBUG: Date parsing error:", dateError); }
                    }
                    if (dateRef.current) dateRef.current.value = formattedDate;

                    if (eventLocationRef.current) eventLocationRef.current.value = data.location || '';
                    if (categoryRef.current) categoryRef.current.value = data.category || 'Technology';
                    if (imageUrlRef.current) imageUrlRef.current.value = data.imageUrl || '';
                    if (priceRef.current) priceRef.current.value = data.price !== undefined && data.price !== null ? data.price : 0;
                    if (availableTicketsRef.current) availableTicketsRef.current.value = data.availableTickets !== undefined && data.availableTickets !== null ? data.availableTickets : 0;
                    if (isPublishedRef.current) isPublishedRef.current.checked = data.isPublished || false;

                    setMessage(''); setError('');

                } catch (err) {
                    console.error('FINAL_UNCONTROLLED_FIX_DEBUG: Error fetching event for edit:', err.response ? err.response.data : err.message);
                    setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to load event for editing.');
                    setIsEditMode(false); // Fallback to create mode if fetch fails
                    setEventId(null);
                } finally {
                    setPageLoading(false); // End loading state
                }
            };
            fetchEventToEdit(); // Execute fetch function

        } else {
            // Create Mode: Clear input refs for a fresh form
            console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Entering Create Mode.");
            setIsEditMode(false);
            setEventId(null);
            // Clear refs for create mode (ensure the form is empty)
            if(nameRef.current) nameRef.current.value = '';
            if(descriptionRef.current) descriptionRef.current.value = '';
            if(dateRef.current) dateRef.current.value = '';
            if(eventLocationRef.current) eventLocationRef.current.value = '';
            if(categoryRef.current) categoryRef.current.value = 'Technology'; // Set default for select
            if(imageUrlRef.current) imageUrlRef.current.value = '';
            if(priceRef.current) priceRef.current.value = 0;
            if(availableTicketsRef.current) availableTicketsRef.current.value = 0;
            if(isPublishedRef.current) isPublishedRef.current.checked = false;

            setMessage(''); setError('');
            setPageLoading(false); // End loading state
        }
    }, [userInfo, navigate, routerLocation.search]); // Dependencies for useEffect

    // No onChange handlers for individual inputs, as they are uncontrolled.
    // Values will be read directly from refs on form submission.

    // handleSubmit: Handles form submission for both Create and Update
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser page refresh
        console.log("FINAL_UNCONTROLLED_FIX_DEBUG: handleSubmit called! Preventing default refresh.");

        // Read current values directly from refs for submission
        const name = nameRef.current ? nameRef.current.value : '';
        const description = descriptionRef.current ? descriptionRef.current.value : '';
        const date = dateRef.current ? dateRef.current.value : '';
        const eventLocation = eventLocationRef.current ? eventLocationRef.current.value : '';
        const category = categoryRef.current ? categoryRef.current.value : 'Technology'; // Select default
        const imageUrl = imageUrlRef.current ? imageUrlRef.current.value : '';
        const price = priceRef.current ? parseFloat(priceRef.current.value) : 0;
        const availableTickets = availableTicketsRef.current ? parseInt(availableTicketsRef.current.value) : 0;
        const isPublished = isPublishedRef.current ? isPublishedRef.current.checked : false;

        console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Current form values from refs:", { name, description, date, eventLocation, category, imageUrl, price, availableTickets, isPublished });

        setMessage(''); setError('');

        if (!userInfo || !userInfo.token) {
            setError('You must be logged in to proceed.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json', }, };
            const eventData = { name, description, date, location: eventLocation, category, imageUrl, price, availableTickets, isPublished };
            console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Event data prepared for API:", eventData);

            if (isEditMode && eventId) {
                // UPDATE existing event
                console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Attempting to UPDATE event with ID:", eventId);
                const response = await axios.put(`http://localhost:5000/api/events/${eventId}`, eventData, config);
                setMessage(`Event "${response.data.name}" updated successfully!`);
            } else {
                // CREATE new event
                console.log("FINAL_UNCONTROLLED_FIX_DEBUG: Attempting to CREATE new event.");
                const response = await axios.post('http://localhost:5000/api/events', eventData, config);
                setMessage(`Event "${response.data.name}" created successfully!`);
                // Clear refs after creation for a fresh form
                if(nameRef.current) nameRef.current.value = '';
                if(descriptionRef.current) descriptionRef.current.value = '';
                if(dateRef.current) dateRef.current.value = '';
                if(eventLocationRef.current) eventLocationRef.current.value = '';
                if(categoryRef.current) categoryRef.current.value = 'Technology';
                if(imageUrlRef.current) imageUrlRef.current.value = '';
                if(priceRef.current) priceRef.current.value = 0;
                if(availableTicketsRef.current) availableTicketsRef.current.value = 0;
                if(isPublishedRef.current) isPublishedRef.current.checked = false;
            }

            if (userInfo.role === 'admin') { navigate('/admin'); } else { navigate('/dashboard'); }
        } catch (err) {
            console.error('FINAL_UNCONTROLLED_DEBUG: Error submitting event form:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.message ? err.response.data.message : 'Failed to save event. Please check your inputs.');
        }
    };

    // Conditional rendering for authorization
    if (!userInfo || (userInfo.role !== 'organizer' && userInfo.role !== 'admin')) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-red-500 text-xl">Access Denied: You must be an organizer or admin to manage events.</div></div>;
    }

    if (pageLoading) {
        return <div className="page-content-wrapper"><div className="text-center py-10 text-white text-xl">Loading Event Data...</div></div>;
    }

    return (
        <div className="page-content-wrapper">
            <div className="form-container">
                <h1 className="form-title mb-6">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>

                {message && <p className="form-message-success">{message}</p>}
                {error && <p className="form-message-error">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Event Name</label>
                        {/* Input is now completely uncontrolled using ref */}
                        <input type="text" id="name" className="form-input" ref={nameRef} placeholder="Enter event name" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea id="description" className="form-input" ref={descriptionRef} placeholder="Enter description" rows="4" required></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="date">Date & Time</label>
                        <input type="datetime-local" id="date" className="form-input" ref={dateRef} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input type="text" id="location" className="form-input" ref={eventLocationRef} placeholder="Enter location" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="category">Category</label>
                        <select id="category" className="form-select" ref={categoryRef} required>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Sports">Sports</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="imageUrl">Image URL</label>
                        <input type="url" id="imageUrl" className="form-input" ref={imageUrlRef} placeholder="Enter image URL" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="price">Ticket Price ($)</label>
                        <input type="number" id="price" className="form-input" ref={priceRef} min="0" step="0.01" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="availableTickets">Available Tickets</label>
                        <input type="number" id="availableTickets" className="form-input" ref={availableTicketsRef} min="0" required />
                    </div>
                    <div className="form-group flex items-center">
                        <input type="checkbox" id="isPublished" className="mr-2" ref={isPublishedRef} />
                        <label className="form-label mb-0" htmlFor="isPublished">Publish Event Immediately</label>
                    </div>
                    <button type="submit" className="btn-success w-full mt-4">
                        {isEditMode ? 'Update Event' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventFormPage;