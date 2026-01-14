import './JobCard.css';

const JobCard = ({ job }) => {
    const {
        title,
        company,
        location,
        salary,
        type,
        description,
        skills = [],
        postedDate,
        companyLogo,
    } = job;

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        const format = (n) => `$${(n / 1000).toFixed(0)}k`;
        if (min && max) return `${format(min)} - ${format(max)}`;
        if (min) return `${format(min)}+`;
        return `Up to ${format(max)}`;
    };

    const getTimeAgo = (date) => {
        if (!date) return '';
        const now = new Date();
        const posted = new Date(date);
        const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="job-card">
            {/* Header with company info */}
            <div className="job-card-header">
                <div className="job-card-company">
                    {companyLogo ? (
                        <img src={companyLogo} alt={company?.name} className="company-logo" />
                    ) : (
                        <div className="company-logo-placeholder">
                            {company?.name?.charAt(0) || 'C'}
                        </div>
                    )}
                    <div className="company-info">
                        <h3 className="company-name">{company?.name || 'Company'}</h3>
                        {postedDate && (
                            <span className="posted-date">{getTimeAgo(postedDate)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Job details */}
            <div className="job-card-body">
                <h2 className="job-title">{title}</h2>

                <div className="job-meta">
                    <div className="job-meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{location || 'Remote'}</span>
                    </div>
                    <div className="job-meta-item">
                        <span className="meta-icon">💰</span>
                        <span>{formatSalary(salary?.min, salary?.max)}</span>
                    </div>
                    <div className="job-meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>{type || 'Full-time'}</span>
                    </div>
                </div>

                {description && (
                    <p className="job-description">{description}</p>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="job-skills">
                        {skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="skill-tag">
                                {skill}
                            </span>
                        ))}
                        {skills.length > 5 && (
                            <span className="skill-tag skill-more">+{skills.length - 5}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer hint */}
            <div className="job-card-footer">
                <span className="swipe-hint">
                    <span className="hint-left">← Skip</span>
                    <span className="hint-drag">Drag or tap buttons</span>
                    <span className="hint-right">Apply →</span>
                </span>
            </div>
        </div>
    );
};

export default JobCard;
