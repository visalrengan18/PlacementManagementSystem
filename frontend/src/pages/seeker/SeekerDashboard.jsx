import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import swipeApi from '../../api/swipeApi';
import './Dashboard.css';

const SeekerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applied: 0, matches: 0 });
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, matchesRes] = await Promise.all([
                    swipeApi.getAppliedJobs(0, 100).catch(() => ({ content: [] })),
                    swipeApi.getSeekerMatches().catch(() => []),
                ]);
                const apps = appsRes.content || appsRes || [];
                const matchList = Array.isArray(matchesRes) ? matchesRes : [];
                setStats({ applied: apps.length, matches: matchList.length });
                setMatches(matchList.slice(0, 3));
            } catch (err) {
                // Silent fail
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="page-container">
            <div className="dashboard">
                <div className="dashboard-header animate-fade-in-up">
                    <div className="welcome-section">
                        <h1 className="dashboard-title">Welcome, <span className="text-gradient">{user?.name || 'Job Seeker'}</span>! 👋</h1>
                        <p className="dashboard-subtitle">Find your dream job today</p>
                    </div>
                </div>

                <div className="stats-grid animate-fade-in-up">
                    <div className="stat-card"><div className="stat-icon stat-icon-primary">📝</div><div className="stat-info"><span className="stat-value">{loading ? '-' : stats.applied}</span><span className="stat-label">Applied</span></div></div>
                    <div className="stat-card stat-card-highlight"><div className="stat-icon stat-icon-success">💕</div><div className="stat-info"><span className="stat-value">{loading ? '-' : stats.matches}</span><span className="stat-label">Matches</span></div></div>
                </div>

                <div className="dashboard-section animate-fade-in-up">
                    <h2 className="section-heading">Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/seeker/jobs" className="action-card"><div className="action-icon">🔥</div><div className="action-content"><h3>Find Jobs</h3><p>Swipe through new opportunities</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/seeker/applications" className="action-card"><div className="action-icon">📋</div><div className="action-content"><h3>Applications</h3><p>Track your applications</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/seeker/profile" className="action-card"><div className="action-icon">👤</div><div className="action-content"><h3>My Profile</h3><p>Update your information</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/seeker/matches" className="action-card"><div className="action-icon">💕</div><div className="action-content"><h3>Matches</h3><p>View your matches</p></div><span className="action-arrow">→</span></Link>
                    </div>
                </div>

                {matches.length > 0 && (
                    <div className="dashboard-section animate-fade-in-up">
                        <div className="section-header"><h2 className="section-heading">Recent Matches</h2><Link to="/seeker/matches" className="section-link">View all →</Link></div>
                        <div className="matches-list">
                            {matches.map((m) => (
                                <div key={m.id} className="match-item">
                                    <Link to={`/profile/${m.company?.userId}`} className="match-avatar no-underline text-inherit block">
                                        {m.company?.name?.charAt(0) || 'C'}
                                    </Link>
                                    <div className="match-info">
                                        <Link to={`/profile/${m.company?.userId}`} className="no-underline text-inherit hover:opacity-80">
                                            <h4 className="match-company">{m.company?.name || 'Company'}</h4>
                                        </Link>
                                        <p className="match-position">{m.job?.title || 'Position'}</p>
                                    </div>
                                    <span className="match-time">{formatTimeAgo(m.matchedAt)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerDashboard;
