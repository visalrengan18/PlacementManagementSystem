import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobApi from '../../api/jobApi';
import swipeApi from '../../api/swipeApi';
import '../seeker/Dashboard.css';

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, matches: 0 });
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, matchesRes] = await Promise.all([
                    jobApi.getCompanyJobs().catch(() => []),
                    swipeApi.getCompanyMatches().catch(() => []),
                ]);
                const jobs = Array.isArray(jobsRes) ? jobsRes : [];
                const matchList = Array.isArray(matchesRes) ? matchesRes : [];
                setStats({ jobs: jobs.length, matches: matchList.length });
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
                        <h1 className="dashboard-title">Welcome, <span className="text-gradient">{user?.name || 'Company'}</span>! 🏢</h1>
                        <p className="dashboard-subtitle">Find your next great hire today</p>
                    </div>
                    <Link to="/company/post-job" className="btn btn-primary btn-lg"><span>➕</span> Post New Job</Link>
                </div>

                <div className="stats-grid animate-fade-in-up">
                    <div className="stat-card"><div className="stat-icon stat-icon-primary">📋</div><div className="stat-info"><span className="stat-value">{loading ? '-' : stats.jobs}</span><span className="stat-label">Active Jobs</span></div></div>
                    <div className="stat-card stat-card-highlight"><div className="stat-icon stat-icon-success">💕</div><div className="stat-info"><span className="stat-value">{loading ? '-' : stats.matches}</span><span className="stat-label">Matches</span></div></div>
                </div>

                <div className="dashboard-section animate-fade-in-up">
                    <h2 className="section-heading">Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/company/jobs" className="action-card"><div className="action-icon">📋</div><div className="action-content"><h3>Manage Jobs</h3><p>View and edit your job postings</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/company/post-job" className="action-card"><div className="action-icon">➕</div><div className="action-content"><h3>Post New Job</h3><p>Create a new job listing</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/company/profile" className="action-card"><div className="action-icon">🏢</div><div className="action-content"><h3>Company Profile</h3><p>Update your company info</p></div><span className="action-arrow">→</span></Link>
                        <Link to="/company/matches" className="action-card"><div className="action-icon">💕</div><div className="action-content"><h3>View Matches</h3><p>Connect with matched candidates</p></div><span className="action-arrow">→</span></Link>
                    </div>
                </div>

                {matches.length > 0 && (
                    <div className="dashboard-section animate-fade-in-up">
                        <div className="section-header"><h2 className="section-heading">Recent Matches</h2><Link to="/company/matches" className="section-link">View all →</Link></div>
                        <div className="matches-list">
                            {matches.map((m) => (
                                <div key={m.id} className="match-item">
                                    <Link to={`/profile/${m.seeker?.userId}`} className="match-avatar no-underline text-inherit block">
                                        {m.seeker?.name?.charAt(0) || 'S'}
                                    </Link>
                                    <div className="match-info">
                                        <Link to={`/profile/${m.seeker?.userId}`} className="no-underline text-inherit hover:opacity-80">
                                            <h4 className="match-company">{m.seeker?.name || 'Candidate'}</h4>
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

export default CompanyDashboard;
