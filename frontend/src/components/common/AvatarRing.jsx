import { useAuth } from '../../context/AuthContext';
import './AvatarRing.css';

/**
 * Instagram-style Avatar with gradient ring showing profile completion
 * @param {Object} props
 * @param {string} props.size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.name - User name (first letter shown)
 * @param {number} props.completion - Profile completion 0-100 (default: 100)
 * @param {string} props.imageUrl - Optional profile image URL
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const AvatarRing = ({
    size = 'md',
    name,
    completion = 100,
    imageUrl,
    onClick,
    className = ''
}) => {
    const { user } = useAuth();

    const displayName = name || user?.name || 'U';
    const initial = displayName.charAt(0).toUpperCase();

    // Determine ring color based on completion
    const getRingClass = () => {
        if (completion >= 100) return 'ring-complete';
        if (completion >= 70) return 'ring-good';
        if (completion >= 40) return 'ring-progress';
        return 'ring-low';
    };

    // Calculate conic gradient angle (0-360)
    const gradientAngle = (completion / 100) * 360;

    return (
        <div
            className={`avatar-ring avatar-ring-${size} ${getRingClass()} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            style={{
                '--completion-angle': `${gradientAngle}deg`
            }}
        >
            <div className="avatar-ring-track">
                <div className="avatar-ring-inner">
                    {imageUrl ? (
                        <img src={imageUrl} alt={displayName} className="avatar-image" />
                    ) : (
                        <span className="avatar-initial">{initial}</span>
                    )}
                </div>
            </div>

            {/* Completion indicator for screen readers */}
            <span className="sr-only">Profile {completion}% complete</span>
        </div>
    );
};

export default AvatarRing;
