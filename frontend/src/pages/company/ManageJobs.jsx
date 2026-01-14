import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import jobApi from '../../api/jobApi';
import './ManageJobs.css';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useNotification();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobApi.getCompanyJobs();
                setJobs(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load jobs');
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleCloseJob = async (jobId) => {
        try {
            await jobApi.closeJob(jobId);
            setJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, status: 'CLOSED' } : job));
            success('Job closed. You can now review applicants!');
        } catch (err) {
            error('Failed to close job');
        }
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
            <div className="manage-jobs-page">
                <div className="page-header">
                    <div>
                        <h1>Manage Jobs</h1>
                        <p className="text-muted">View and manage your job postings</p>
                    </div>
                    <Link to="/company/post-job" className="btn btn-primary">➕ Post New Job</Link>
                </div>

                {jobs.length > 0 ? (
                    <div className="jobs-list">
                        {jobs.map((job) => (
                            <div key={job.id} className="job-list-card">
                                <div className="job-list-main">
                                    <h3>{job.title}</h3>
                                    <div className="job-list-meta">
                                        <span>📍 {job.location || 'No location'}</span>
                                        <span>📅 Posted {formatDate(job.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="job-list-actions">
                                    <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                                        {job.status === 'OPEN' ? '🟢 Open' : '🔒 Closed'}
                                    </span>
                                    <Link to={`/company/applicants/${job.id}`} className="btn btn-primary btn-sm">Review Applicants</Link>
                                    {job.status === 'OPEN' && (
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleCloseJob(job.id)}>Close Job</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No jobs posted yet</h3>
                        <p>Create your first job posting to start receiving applications!</p>
                        <Link to="/company/post-job" className="btn btn-primary">Post a Job</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
