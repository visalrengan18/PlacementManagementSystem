import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isSeeker, isCompany, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">💼</span>
                    <span className="brand-text text-gradient">JobSwipe</span>
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            {isSeeker && (
                                <>
                                    <Link
                                        to="/seeker/dashboard"
                                        className={`nav-link ${isActive('/seeker/dashboard') ? 'active' : ''}`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/seeker/companies"
                                        className={`nav-link ${isActive('/seeker/companies') ? 'active' : ''}`}
                                    >
                                        🏢 Companies
                                    </Link>
                                    <Link
                                        to="/seeker/jobs"
                                        className={`nav-link ${isActive('/seeker/jobs') ? 'active' : ''}`}
                                    >
                                        Find Jobs
                                    </Link>
                                    <Link
                                        to="/seeker/applications"
                                        className={`nav-link ${isActive('/seeker/applications') ? 'active' : ''}`}
                                    >
                                        Applications
                                    </Link>
                                    <Link
                                        to="/seeker/matches"
                                        className={`nav-link ${isActive('/seeker/matches') ? 'active' : ''}`}
                                    >
                                        Matches
                                    </Link>
                                    <Link
                                        to="/seeker/views"
                                        className={`nav-link ${isActive('/seeker/views') ? 'active' : ''}`}
                                    >
                                        👀 Views
                                    </Link>
                                </>
                            )}

                            {isCompany && (
                                <>
                                    <Link
                                        to="/company/dashboard"
                                        className={`nav-link ${isActive('/company/dashboard') ? 'active' : ''}`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/company/jobs"
                                        className={`nav-link ${isActive('/company/jobs') ? 'active' : ''}`}
                                    >
                                        My Jobs
                                    </Link>
                                    <Link
                                        to="/company/post-job"
                                        className={`nav-link ${isActive('/company/post-job') ? 'active' : ''}`}
                                    >
                                        Post Job
                                    </Link>
                                    <Link
                                        to="/company/matches"
                                        className={`nav-link ${isActive('/company/matches') ? 'active' : ''}`}
                                    >
                                        Matches
                                    </Link>
                                </>
                            )}

                            <Link
                                to="/chats"
                                className={`nav-link ${isActive('/chats') ? 'active' : ''}`}
                            >
                                💬 Messages
                            </Link>

                            <div className="navbar-user">
                                <Link to={isSeeker ? '/seeker/profile' : '/company/profile'} className="user-avatar-btn">
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
