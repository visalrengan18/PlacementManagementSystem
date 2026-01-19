import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="landing-container">
                {/* Navbar */}
                <nav className="landing-nav fade-up" style={{ animationDelay: '0.1s' }}>
                    <Link to="/" className="nav-logo">JobSwipe.</Link>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Link to="/login" className="btn-secondary">Log In</Link>
                        <Link to="/register" className="btn-primary">Sign Up</Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content fade-up" style={{ animationDelay: '0.2s' }}>
                        <h1 className="landing-hero-title">
                            Find your dream job <br />
                            <span className="highlight">without the noise.</span>
                        </h1>
                        <p className="landing-subtitle">
                            Connect directly with top companies. No cover letters, no ghosts.
                            Just meaningful conversations and career-changing matches.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary">Get Started Free</Link>
                            <Link to="/login" className="btn-secondary">View Demo</Link>
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            <span>Trusted by engineers at</span>
                            <strong style={{ color: 'var(--color-text-primary)' }}>Google</strong>
                            <strong style={{ color: 'var(--color-text-primary)' }}>Meta</strong>
                            <strong style={{ color: 'var(--color-text-primary)' }}>Netflix</strong>
                        </div>
                    </div>

                    {/* Hero Visual (3D Glassmorphism) */}
                    <div className="hero-visual fade-up" style={{ animationDelay: '0.4s' }}>
                        <div className="ui-mockup">
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div className="ui-line" style={{ width: '100px', background: 'rgba(0,0,0,0.1)' }}></div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div className="ui-line" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                                    <div className="ui-line" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
                                    <div className="ui-line" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                                </div>
                            </div>
                            {/* Cards */}
                            <div className="ui-block" style={{ display: 'flex', padding: '20px', gap: '20px', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-gold)', boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div className="ui-line" style={{ width: '40%', marginBottom: '12px' }}></div>
                                    <div className="ui-line" style={{ width: '70%', opacity: 0.6 }}></div>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)' }}></div>
                            </div>
                            <div className="ui-block" style={{ opacity: 0.7, transform: 'scale(0.98)' }}></div>
                            <div className="ui-block" style={{ opacity: 0.4, transform: 'scale(0.96)' }}></div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Features Section */}
            <section className="features-section">
                <div className="landing-container">
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.03em' }}>
                            Built for modern recruiting.
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', fontWeight: '300' }}>
                            Everything you need to find your next role, or your next star employee.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Instant Matches</h3>
                            <p className="feature-desc">Stop waiting for emails. Get notified instantly when there's mutual interest.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Private by Default</h3>
                            <p className="feature-desc">Your profile is only visible to companies you match with or apply to.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3 className="feature-title">Direct Chat</h3>
                            <p className="feature-desc">Cut through the noise. Chat directly with hiring managers and team leads.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ background: 'var(--color-bg-secondary)', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
                <div className="landing-container" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <p>&copy; 2026 JobSwipe Inc. Clean. Clear. Connected.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
