import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import companyApi from '../../api/companyApi';
import swipeApi from '../../api/swipeApi';
import { useNotification } from '../../context/NotificationContext';
import './CompanyDetails.css';

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useNotification();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [companyData, jobsData] = await Promise.all([
                companyApi.getDetails(id),
                companyApi.getJobs(id)
            ]);
            setCompany(companyData);
            setJobs(jobsData.content || []);
        } catch (err) {
            error('Failed to load company details');
            navigate('/seeker/companies');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await swipeApi.swipeJob(jobId, 'RIGHT');
            success('Application submitted successfully!');
            // Refresh jobs to update status
            const jobsData = await companyApi.getJobs(id);
            setJobs(jobsData.content || []);
        } catch (err) {
            error(err.response?.data?.message || 'Failed to apply');
        }
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    if (!company) return null;

    return (
        <div className="page-container">
            <div className="company-details-page">
                {/* Header */}
                <div className="company-header-card">
                    <div className="company-header-content">
                        <div className="company-logo-large">
                            {company.name.charAt(0)}
                        </div>
                        <div className="company-header-info">
                            <h1>{company.name}</h1>
                            <div className="company-tags">
                                <span className="tag">🏭 {company.industry || 'Tech'}</span>
                                <span className="tag">📍 {company.location || 'Remote'}</span>
                                <span className="tag">👥 {company.size || 'Unknown Size'}</span>
                            </div>
                            <p className="company-description">{company.description || 'No description available.'}</p>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="website-link">
                                    Visit Website ↗
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <div className="jobs-section">
                    <h2>Open Positions ({jobs.length})</h2>

                    <div className="jobs-list">
                        {jobs.map((item) => {
                            const { job, applicationStatus } = item;
                            return (
                                <div key={job.id} className="job-item-card">
                                    <div className="job-info">
                                        <h3>{job.title}</h3>
                                        <div className="job-meta">
                                            <span>💰 ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
                                            <span>📍 {job.location}</span>
                                            <span>📝 {job.type}</span>
                                        </div>
                                        <div className="job-skills">
                                            {job.skills?.slice(0, 3).map(skill => (
                                                <span key={skill} className="skill-pill">{skill}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="job-action">
                                        {applicationStatus ? (
                                            <span className={`status-badge ${applicationStatus.toLowerCase()}`}>
                                                {applicationStatus}
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleApply(job.id)}
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {jobs.length === 0 && (
                            <div className="empty-jobs">
                                <p>No open positions at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
