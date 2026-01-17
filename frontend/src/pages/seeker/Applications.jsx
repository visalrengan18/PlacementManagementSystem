import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import swipeApi from '../../api/swipeApi';
import './Applications.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const { error } = useNotification();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await swipeApi.getAppliedJobs(0, 50);
                const data = response.content || response;
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load applications');
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const filterApplications = (apps) => {
        if (filter === 'ALL') return apps;
        return apps.filter((app) => app.status === filter);
    };

    const filteredApps = filterApplications(applications);

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { class: 'pending', label: '⏳ Pending' },
            VIEWED: { class: 'viewed', label: '👀 Viewed' },
            ACCEPTED: { class: 'matched', label: '💕 Matched' },
            REJECTED: { class: 'rejected', label: '✕ Rejected' },
        };
        return statusMap[status] || { class: 'pending', label: status };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            <div className="applications-page">
                <div className="page-header center-header">
                    <h1>My Applications</h1>
                    <p className="text-muted">Track and manage your job application status</p>
                </div>

                <div className="app-stats">
                    <div className="app-stat">
                        <span className="stat-number">{applications.length}</span>
                        <span className="stat-text">Total</span>
                    </div>
                    <div className="app-stat">
                        <span className="stat-number">{applications.filter(a => a.status === 'PENDING').length}</span>
                        <span className="stat-text">Pending</span>
                    </div>
                    <div className="app-stat highlight">
                        <span className="stat-number">{applications.filter(a => a.status === 'ACCEPTED').length}</span>
                        <span className="stat-text">Matched</span>
                    </div>
                </div>

                <div className="filter-tabs-container">
                    <div className="filter-tabs">
                        {['ALL', 'PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED'].map((tab) => (
                            <button
                                key={tab}
                                className={`filter-tab ${filter === tab ? 'active' : ''}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredApps.length > 0 ? (
                    <div className="applications-list">
                        {filteredApps.map((app) => {
                            const status = getStatusBadge(app.status);
                            return (
                                <div key={app.id} className="application-card">
                                    <Link to={`/profile/${app.job?.company?.userId}`} className="app-company-logo no-underline text-inherit block hover:opacity-80">
                                        {app.job?.company?.name?.charAt(0) || 'C'}
                                    </Link>
                                    <div className="app-details">
                                        <h3 className="app-title">{app.job?.title || 'Job Title'}</h3>
                                        <Link to={`/profile/${app.job?.company?.userId}`} className="no-underline text-inherit hover:opacity-80">
                                            <p className="app-company">{app.job?.company?.name || 'Company'}</p>
                                        </Link>
                                        <p className="app-date">Applied on {formatDate(app.appliedAt)}</p>
                                    </div>
                                    <div className="app-status">
                                        <span className={`badge ${status.class}`}>{status.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📂</div>
                        <h3>No applications found</h3>
                        <p>You haven't applied to any jobs with this status yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
