import { useState, useEffect } from 'react';
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
                <div className="page-header">
                    <h1>My Applications</h1>
                    <p className="text-muted">Track the status of your job applications</p>
                </div>

                <div className="applications-stats">
                    <div className="stat-item">
                        <span className="stat-value">{applications.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{applications.filter(a => a.status === 'PENDING').length}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{applications.filter(a => a.status === 'ACCEPTED').length}</span>
                        <span className="stat-label">Matched</span>
                    </div>
                </div>

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

                {filteredApps.length > 0 ? (
                    <div className="applications-list">
                        {filteredApps.map((app) => {
                            const status = getStatusBadge(app.status);
                            return (
                                <div key={app.id} className="application-card">
                                    <div className="application-company">
                                        <div className="company-logo">{app.job?.company?.name?.charAt(0) || 'C'}</div>
                                        <div className="application-info">
                                            <h3>{app.job?.title || 'Job Title'}</h3>
                                            <p>{app.job?.company?.name || 'Company'}</p>
                                        </div>
                                    </div>
                                    <div className="application-meta">
                                        <span className={`status-badge ${status.class}`}>{status.label}</span>
                                        <span className="application-date">{formatDate(app.appliedAt)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No applications yet</h3>
                        <p>Start swiping on jobs to see your applications here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
