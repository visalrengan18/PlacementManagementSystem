import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import swipeApi from '../../api/swipeApi';
import profileApi from '../../api/profileApi';
import { SkeletonStatCard } from '../../components/common/SkeletonLoader';
import ProfileProgress from '../../components/common/ProfileProgress';
import { useConfetti } from '../../components/common/Confetti';
import './Dashboard.css';

// Custom hook for counting animation
const useCountUp = (end, duration = 1000, shouldStart = true) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (!shouldStart || end === 0) {
            setCount(end);
            return;
        }

        countRef.current = 0;
        startTimeRef.current = null;

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            if (currentCount !== countRef.current) {
                countRef.current = currentCount;
                setCount(currentCount);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, shouldStart]);

    return count;
};

const SeekerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applied: 0, matches: 0 });
    const [matches, setMatches] = useState([]);
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [previousMatches, setPreviousMatches] = useState(0);
    const { triggerConfetti, ConfettiComponent } = useConfetti();

    // Animated stat counts
    const animatedApplied = useCountUp(stats.applied, 1200, !loading);
    const animatedMatches = useCountUp(stats.matches, 1200, !loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, matchesRes, profileRes] = await Promise.all([
                    swipeApi.getAppliedJobs(0, 100).catch(() => ({ content: [] })),
                    swipeApi.getSeekerMatches().catch(() => []),
                    profileApi.getSeekerProfile().catch(() => ({})),
                ]);
                const apps = appsRes.content || appsRes || [];
                const matchList = Array.isArray(matchesRes) ? matchesRes : [];

                // Check for new matches to trigger confetti
                if (previousMatches > 0 && matchList.length > previousMatches) {
                    triggerConfetti();
                }
                setPreviousMatches(matchList.length);

                setStats({ applied: apps.length, matches: matchList.length });
                setMatches(matchList.slice(0, 3));
                setProfile(profileRes);
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

    // Show skeleton while loading
    if (loading) {
        return (
            <div className="page-container">
                <ConfettiComponent />
                <div className="dashboard">
                    <div className="dashboard-header animate-fade-in-up">
                        <div className="welcome-section">
                            <h1 className="dashboard-title">Welcome, <span className="text-gradient">{user?.name || 'Job Seeker'}</span>! 👋</h1>
                            <p className="dashboard-subtitle">Find your dream job today</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </div>

                    <div className="dashboard-section">
                        <h2 className="section-heading">Quick Actions</h2>
                        <div className="actions-grid">
                            <div className="action-card skeleton-action-card"></div>
                            <div className="action-card skeleton-action-card"></div>
                            <div className="action-card skeleton-action-card"></div>
                            <div className="action-card skeleton-action-card"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <ConfettiComponent />
            <div className="dashboard">
                <div className="dashboard-header animate-fade-in-up">
                    <div className="welcome-section">
                        <h1 className="dashboard-title">Welcome, <span className="text-gradient">{user?.name || 'Job Seeker'}</span>! <span className="wave-emoji">👋</span></h1>
                        <p className="dashboard-subtitle">Find your dream job today</p>
                    </div>
                </div>

                <div className="stats-grid">
                    {/* Applied Jobs Card */}
                    <div className="stat-card animate-stat-card animate-stagger-1">
                        <div className="stat-icon stat-icon-primary animate-icon-glow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{animatedApplied}</span>
                            <span className="stat-label">Applied Jobs</span>
                        </div>
                    </div>

                    {/* Matches Card */}
                    <div className="stat-card stat-card-highlight animate-stat-card animate-stagger-2">
                        <div className="stat-icon stat-icon-success animate-icon-glow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{animatedMatches}</span>
                            <span className="stat-label">Matches</span>
                        </div>
                    </div>

                    {/* Profile Views Card */}
                    <div className="stat-card animate-stat-card animate-stagger-3">
                        <div className="stat-icon stat-icon-gold animate-icon-glow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">—</span>
                            <span className="stat-label">Profile Views</span>
                        </div>
                    </div>
                </div>

                {/* Profile Progress Section */}
                <div className="dashboard-grid">
                    <div className="dashboard-section animate-fade-in-up">
                        <h2 className="section-heading">Quick Actions</h2>
                        <div className="actions-grid">
                            <Link to="/seeker/jobs" className="action-card action-card-primary"><div className="action-icon">🔥</div><div className="action-content"><h3>Find Jobs</h3><p>Swipe through new opportunities</p></div><span className="action-arrow">→</span></Link>
                            <Link to="/seeker/applications" className="action-card"><div className="action-icon">📋</div><div className="action-content"><h3>Applications</h3><p>Track your applications</p></div><span className="action-arrow">→</span></Link>
                            <Link to="/seeker/profile" className="action-card"><div className="action-icon">👤</div><div className="action-content"><h3>My Profile</h3><p>Update your information</p></div><span className="action-arrow">→</span></Link>
                            <Link to="/seeker/matches" className="action-card"><div className="action-icon">💕</div><div className="action-content"><h3>Matches</h3><p>View your matches</p></div><span className="action-arrow">→</span></Link>
                        </div>
                    </div>

                    <div className="dashboard-sidebar animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <ProfileProgress profile={profile} userType="seeker" />
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
                                    <Link to={`/seeker/job/${m.job?.id}`} className="match-cta">View Job →</Link>
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

