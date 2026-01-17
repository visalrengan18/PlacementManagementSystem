import './ProfileCard.css';

const ProfileCard = ({ profile, type = 'seeker', showSwipeHints = true }) => {
    if (type === 'seeker') {
        return <SeekerProfileCard profile={profile} showSwipeHints={showSwipeHints} />;
    }
    return <CompanyProfileCard profile={profile} showSwipeHints={showSwipeHints} />;
};

const SeekerProfileCard = ({ profile, showSwipeHints }) => {
    const {
        name,
        title,
        location,
        experience,
        education,
        skills = [],
        bio,
        resumeUrl,
        avatar,
    } = profile;

    return (
        <div className="profile-card seeker-profile">
            <div className="profile-card-header">
                {avatar ? (
                    <img src={avatar} alt={name} className="profile-avatar-large" />
                ) : (
                    <div className="profile-avatar-large profile-avatar-placeholder">
                        {name?.charAt(0) || 'U'}
                    </div>
                )}
                <div className="profile-header-info">
                    <h2 className="profile-name">{name}</h2>
                    <p className="profile-title">{title}</p>
                    {location && (
                        <span className="profile-location">
                            <span>📍</span> {location}
                        </span>
                    )}
                </div>
            </div>

            <div className="profile-card-body">
                {bio && <p className="profile-bio">{bio}</p>}

                {experience && (
                    <div className="profile-section">
                        <h4 className="section-title">Experience</h4>
                        <p className="section-content">{experience}</p>
                    </div>
                )}

                {education && (
                    <div className="profile-section">
                        <h4 className="section-title">Education</h4>
                        <p className="section-content">{education}</p>
                    </div>
                )}

                {skills.length > 0 && (
                    <div className="profile-section">
                        <h4 className="section-title">Skills</h4>
                        <div className="profile-skills">
                            {skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {resumeUrl && (
                    <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 'auto' }}
                    >
                        📄 View Resume
                    </a>
                )}
            </div>

            {showSwipeHints && (
                <div className="profile-card-footer">
                    <span className="swipe-hint">
                        <span className="hint-left">← Reject</span>
                        <span className="hint-drag">Swipe to decide</span>
                        <span className="hint-right">Accept →</span>
                    </span>
                </div>
            )}
        </div>
    );
};

const CompanyProfileCard = ({ profile }) => {
    const {
        name,
        industry,
        location,
        size,
        description,
        website,
        logo,
    } = profile;

    return (
        <div className="profile-card company-profile">
            <div className="profile-card-header">
                {logo ? (
                    <img src={logo} alt={name} className="company-logo-large" />
                ) : (
                    <div className="company-logo-large company-logo-placeholder">
                        {name?.charAt(0) || 'C'}
                    </div>
                )}
                <div className="profile-header-info">
                    <h2 className="profile-name">{name}</h2>
                    <p className="profile-title">{industry}</p>
                    {location && (
                        <span className="profile-location">
                            <span>📍</span> {location}
                        </span>
                    )}
                </div>
            </div>

            <div className="profile-card-body">
                {description && <p className="profile-bio">{description}</p>}

                {size && (
                    <div className="profile-meta-item">
                        <span>👥</span>
                        <span>Company Size: {size}</span>
                    </div>
                )}

                {website && (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 'auto' }}
                    >
                        🌐 Visit Website
                    </a>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
