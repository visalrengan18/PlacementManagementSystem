import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jobApi from '../../api/jobApi';
import { useNotification } from '../../context/NotificationContext';
import './JobDetails.css';

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { error, success } = useNotification();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await jobApi.getJobById(jobId);
                setJob(response);
            } catch (err) {
                console.error(err);
                error('Failed to load job details');
                navigate('/seeker/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchJob();
    }, [jobId]);

    if (loading) return <div className="page-center"><div className="spinner"></div></div>;
    if (!job) return <div className="page-center">Job not found</div>;

    return (
        <div className="job-details-page">
            <div className="job-details-container">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                <div className="job-header-section">
                    <img
                        src={job.company.logoUrl || `https://ui-avatars.com/api/?name=${job.company.name}&background=random`}
                        alt="Company Logo"
                        className="company-logo-lg"
                    />
                    <div className="job-title-info">
                        <h1>{job.title}</h1>
                        <Link to={`/profile/${job.company.userId}`} className="company-link">
                            <h2>{job.company.name}</h2>
                        </Link>
                        <div className="job-badges">
                            <span className="badge location">📍 {job.location}</span>
                            <span className="badge type">💼 {job.type}</span>
                            <span className="badge salary">💰 ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="job-body-section">
                    <section>
                        <h3>Description</h3>
                        <p>{job.description}</p>
                    </section>

                    <section>
                        <h3>Requirements</h3>
                        <p>{job.requirements}</p>
                    </section>

                    <section>
                        <h3>Skills</h3>
                        <div className="skills-list">
                            {job.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
