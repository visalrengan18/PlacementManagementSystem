import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileProgress.css';

const ProfileProgress = ({
    profile = {},
    userType = 'seeker',
    showDetails = true
}) => {
    // Define required fields based on user type
    const requiredFields = userType === 'seeker'
        ? [
            { key: 'title', label: 'Professional Title', icon: '💼' },
            { key: 'location', label: 'Location', icon: '📍' },
            { key: 'phone', label: 'Phone Number', icon: '📱' },
            { key: 'bio', label: 'About/Bio', icon: '📝' },
            { key: 'experience', label: 'Experience', icon: '⏳' },
            { key: 'education', label: 'Education', icon: '🎓' },
            { key: 'skills', label: 'Skills', icon: '🛠️', isArray: true },
            { key: 'resumeUrl', label: 'Resume', icon: '📄' },
        ]
        : [
            { key: 'companyName', label: 'Company Name', icon: '🏢' },
            { key: 'industry', label: 'Industry', icon: '🏭' },
            { key: 'location', label: 'Location', icon: '📍' },
            { key: 'description', label: 'Description', icon: '📝' },
            { key: 'website', label: 'Website', icon: '🌐' },
            { key: 'size', label: 'Company Size', icon: '👥' },
        ];

    // Calculate completion
    const completedFields = requiredFields.filter(field => {
        const value = profile[field.key];
        if (field.isArray) {
            return Array.isArray(value) && value.length > 0;
        }
        return value && value.toString().trim() !== '';
    });

    const missingFields = requiredFields.filter(field => {
        const value = profile[field.key];
        if (field.isArray) {
            return !Array.isArray(value) || value.length === 0;
        }
        return !value || value.toString().trim() === '';
    });

    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);

    // Determine status color and message
    const getStatus = () => {
        if (percentage === 100) return { color: 'success', message: 'Profile Complete! 🎉' };
        if (percentage >= 75) return { color: 'good', message: 'Almost there!' };
        if (percentage >= 50) return { color: 'warning', message: 'Keep going!' };
        return { color: 'low', message: 'Complete your profile' };
    };

    const status = getStatus();

    return (
        <div className="profile-progress-card card">
            <div className="profile-progress-header">
                <h3>Profile Strength</h3>
                <span className={`progress-status progress-status-${status.color}`}>
                    {status.message}
                </span>
            </div>

            <div className="profile-progress-ring-container">
                <svg className="progress-ring" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        className="progress-ring-bg"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                        className={`progress-ring-fill progress-ring-${status.color}`}
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div className="progress-percentage">
                    <span className="progress-number">{percentage}</span>
                    <span className="progress-symbol">%</span>
                </div>
            </div>

            {showDetails && missingFields.length > 0 && (
                <div className="profile-progress-details">
                    <p className="missing-label">Missing:</p>
                    <div className="missing-fields">
                        {missingFields.slice(0, 3).map(field => (
                            <span key={field.key} className="missing-field-tag">
                                {field.icon} {field.label}
                            </span>
                        ))}
                        {missingFields.length > 3 && (
                            <span className="missing-field-more">
                                +{missingFields.length - 3} more
                            </span>
                        )}
                    </div>
                    <Link
                        to={userType === 'seeker' ? '/seeker/profile' : '/company/profile'}
                        className="btn btn-primary btn-sm complete-profile-btn"
                    >
                        Complete Profile
                    </Link>
                </div>
            )}

            {percentage === 100 && (
                <div className="profile-complete-message">
                    <span className="complete-icon">✨</span>
                    <p>Your profile is looking great!</p>
                </div>
            )}
        </div>
    );
};

export default ProfileProgress;
