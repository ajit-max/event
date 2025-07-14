// client/src/pages/HomePage.jsx
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber'; // For 3D rendering
import { OrbitControls, Environment, Stars } from '@react-three/drei'; // Helpful 3D components like Stars and Environment
import { gsap } from 'gsap'; // For animations
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // For scroll-based animations

// GSAP plugins ko register karo (Globally, once)
gsap.registerPlugin(ScrollTrigger);

// --- 3D Components ---
// Basic Rotating Shape for Hero Section Background
function RotatingShape() {
    const mesh = useRef();
    // useFrame hook har frame par chalega for animation
    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.005; // Adjust speed as needed
            mesh.current.rotation.y += 0.005; // Adjust speed as needed
        }
    });
    return (
        <mesh ref={mesh} scale={2}>
            <torusKnotGeometry args={[1, 0.3, 100, 16]} /> {/* Changed to torusKnot for more complexity */}
            <meshStandardMaterial color="#c084fc" /> {/* Purple color */}
        </mesh>
    );
}

// Animated Hero Section with 3D Canvas
const AnimatedHero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false); // For CSS animations

    useEffect(() => {
        // Trigger CSS animation on component mount
        setIsVisible(true);

        // GSAP animations for elements inside hero
        // These animations are now managed by GSAP for better control
        gsap.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(buttonRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 });

    }, []);

    return (
        <div className="hero-container">
            {/* 3D Canvas for interactive background */}
            <Canvas className="hero-canvas">
                {/* OrbitControls: Allows camera movement/rotation (disabled zoom for background effect) */}
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                {/* AmbientLight: General scene illumination */}
                <ambientLight intensity={0.5} />
                {/* DirectionalLight: Simulates sun light for shadows/highlights */}
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                {/* Suspense: Fallback for loading 3D assets */}
                <Suspense fallback={null}>
                    <RotatingShape /> {/* Our custom rotating 3D shape */}
                    <Environment preset="city" /> {/* Realistic environment lighting (pre-configured) */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> {/* Background stars */}
                </Suspense>
            </Canvas>

            {/* Content Overlay */}
            <div className="hero-content-overlay">
                <h1 ref={titleRef} className="hero-title">
                    Elevate Your Events. Experience the Future.
                </h1>
                <p ref={subtitleRef} className="hero-subtitle">
                    Discover, create, and manage unforgettable events with our immersive platform.
                </p>
                <Link ref={buttonRef} to="/events" className="hero-button">
                    Explore Events
                </Link>
            </div>
        </div>
    );
};

// --- Sections for HomePage ---

const FeaturedEventsSection = () => {
    const featuredEventsSectionRef = useRef(null);
    const eventCardsRef = useRef([]); // To hold refs for individual cards for GSAP

    useEffect(() => {
        // GSAP for section fade-in on scroll
        gsap.fromTo(
            featuredEventsSectionRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: featuredEventsSectionRef.current,
                    start: 'top 80%', // When the top of the section enters 80% from the top of the viewport
                    toggleActions: 'play none none reverse', // Play on enter, reverse on leave
                },
            }
        );

        // GSAP for staggered card animation on scroll
        // This will animate each card one by one when its visible
        eventCardsRef.current.forEach((card, index) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 20 }, // Start from transparent and slightly below
                {
                    opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, // Staggered delay
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%', // When the top of the card enters 90% from the top of the viewport
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
    }, []);

    return (
        <section ref={featuredEventsSectionRef} className="featured-events-section">
            <div className="container py-16">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Events</h2>
                <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-8">
                    {/* Dummy Event Cards - Replace with actual data fetching */}
                    <div ref={el => eventCardsRef.current[0] = el} className="event-card">
                        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tech Summit" className="event-card-image" />
                        <div className="event-card-content">
                            <h3 className="event-card-title">Global Tech Summit 2025</h3>
                            <p className="event-card-info">Oct 20, 2025</p>
                            <p className="event-card-info">New York, USA</p>
                        </div>
                    </div>
                    <div ref={el => eventCardsRef.current[1] = el} className="event-card">
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D" alt="Music Fest" className="event-card-image" />
                        <div className="event-card-content">
                            <h3 className="event-card-title">Summer Music Fest</h3>
                            <p className="event-card-info">Aug 15, 2025</p>
                            <p className="event-card-info">Mumbai, India</p>
                        </div>
                    </div>
                    <div ref={el => eventCardsRef.current[2] = el} className="event-card">
                        <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Startup Pitch" className="event-card-image" />
                        <div className="event-card-content">
                            <h3 className="event-card-title">Startup Pitch Day</h3>
                            <p className="event-card-info">Sep 01, 2025</p>
                            <p className="event-card-info">Bengaluru, India</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CallToActionSection = () => {
    const ctaSectionRef = useRef(null);
    useEffect(() => {
        gsap.fromTo(
            ctaSectionRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: ctaSectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }, []);

    return (
        <section ref={ctaSectionRef} className="cta-section">
            <div className="container py-16 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to elevate your event experience?</h2>
                <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
                    Join our platform today and start creating or discovering amazing events.
                </p>
                <Link to="/auth" className="cta-button">
                    Get Started
                </Link>
            </div>
        </section>
    );
};

// Main HomePage Component
const HomePage = () => (
    <div className="home-page">
        <AnimatedHero />
        <FeaturedEventsSection />
        <CallToActionSection />
    </div>
);

export default HomePage;