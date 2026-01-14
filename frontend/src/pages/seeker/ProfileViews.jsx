import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import swipeApi from '../../api/swipeApi';
import './ProfileViews.css';

const ProfileViews = () => {
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error } = useNotification();

    useEffect(() => {
        const fetchViews = async () => {
            try {
                setLoading(true);
                const response = await swipeApi.getProfileViews(0, 50);
                const data = response.content || response;
                setViews(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load profile views');
                setViews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchViews();
    }, []);

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="views-page">
                <div className="page-header center-header">
                    <h1>Who Viewed My Profile 👀</h1>
                    <p className="text-muted">See which companies are checking you out</p>
                </div>

                <div className="views-stats">
                    <div className="view-stat">
                        <span className="stat-number">{views.length}</span>
                        <span className="stat-text">Total Views</span>
                    </div>
                    <div className="view-stat highlight">
                        <span className="stat-number">
                            {views.filter(v => {
                                const date = new Date(v.viewedAt);
                                const now = new Date();
                                return (now - date) < (24 * 60 * 60 * 1000);
                            }).length}
                        </span>
                        <span className="stat-text">Last 24h</span>
                    </div>
                </div>

                {views.length > 0 ? (
                    <div className="views-list">
                        {views.map((view, index) => (
                            <div key={`${view.jobId}-${index}`} className="view-card">
                                <div className="view-company-logo">
                                    {view.companyLogo || 'C'}
                                </div>
                                <div className="view-details">
                                    <h3 className="view-company">{view.companyName}</h3>
                                    <p className="view-context">Viewed your application for <span className="text-primary">{view.jobTitle}</span></p>
                                </div>
                                <div className="view-meta">
                                    <span className="time-badge">{formatTimeAgo(view.viewedAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">👀</div>
                        <h3>No views yet</h3>
                        <p>Apply to more jobs to get noticed by companies!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileViews;
