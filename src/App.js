// client/src/App.js - FINAL Corrected Code
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EventFormPage from './pages/EventFormPage'; // Correct import name for EventFormPage
import BookTicketPage from './pages/BookTicketPage';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Import global CSS
import './App.css'; 
// Import HomePage specific CSS (for 3D and its animations)
import './HomePage.css'; 

function App() {
    return (
        <Router>
            <div className="app-container"> {/* Global app container class */}
                <Navbar />
                <main className="main-content"> {/* Main content area class */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/events" element={<EventListPage />} />
                        <Route path="/events/:id" element={<EventDetailPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        {/* FIX: Only one correct route for EventFormPage, using /event-form path */}
                        <Route path="/event-form" element={<EventFormPage />} /> 
                        <Route path="/book-ticket/:eventId" element={<BookTicketPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;