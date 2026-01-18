import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isSeeker, isCompany, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <span className="brand-text">JobSwipe</span>
                </Link>


                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            {isSeeker && (
                                <>
                                    <Link to="/seeker/dashboard" className={`nav-link ${isActive('/seeker/dashboard') ? 'active' : ''}`} onClick={closeMenu}>Dashboard</Link>
                                    <Link to="/seeker/companies" className={`nav-link ${isActive('/seeker/companies') ? 'active' : ''}`} onClick={closeMenu}>Companies</Link>
                                    <Link to="/seeker/jobs" className={`nav-link ${isActive('/seeker/jobs') ? 'active' : ''}`} onClick={closeMenu}>Find Jobs</Link>
                                    <Link to="/seeker/applications" className={`nav-link ${isActive('/seeker/applications') ? 'active' : ''}`} onClick={closeMenu}>Applications</Link>
                                    <Link to="/seeker/matches" className={`nav-link ${isActive('/seeker/matches') ? 'active' : ''}`} onClick={closeMenu}>Matches</Link>
                                    <Link to="/seeker/views" className={`nav-link ${isActive('/seeker/views') ? 'active' : ''}`} onClick={closeMenu}>Views</Link>
                                </>
                            )}

                            {isCompany && (
                                <>
                                    <Link to="/company/dashboard" className={`nav-link ${isActive('/company/dashboard') ? 'active' : ''}`} onClick={closeMenu}>Dashboard</Link>
                                    <Link to="/company/jobs" className={`nav-link ${isActive('/company/jobs') ? 'active' : ''}`} onClick={closeMenu}>Jobs</Link>
                                    <Link to="/company/post-job" className={`nav-link ${isActive('/company/post-job') ? 'active' : ''}`} onClick={closeMenu}>Post Job</Link>
                                    <Link to="/company/matches" className={`nav-link ${isActive('/company/matches') ? 'active' : ''}`} onClick={closeMenu}>Matches</Link>
                                </>
                            )}

                            <Link to="/chats" className={`nav-link ${isActive('/chats') ? 'active' : ''}`} onClick={closeMenu}>Messages</Link>
                            <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`} onClick={closeMenu}>Search</Link>
                            <Link to="/network" className={`nav-link ${isActive('/network') ? 'active' : ''}`} onClick={closeMenu}>Network</Link>

                            <NotificationDropdown />

                            <div className="navbar-user">
                                <Link to={isSeeker ? '/seeker/profile' : '/company/profile'} className="user-avatar-btn" onClick={closeMenu}>
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="nav-link" style={{ fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="nav-link" style={{ color: 'var(--color-primary)' }} onClick={closeMenu}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
