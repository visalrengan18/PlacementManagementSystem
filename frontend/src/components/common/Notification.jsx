import { useNotification } from '../../context/NotificationContext';
import './Notification.css';

const Notification = () => {
    const { notifications, removeNotification } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'match':
                return '💕';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification notification-${notification.type}`}
                >
                    <span className="notification-icon">{getIcon(notification.type)}</span>
                    <span className="notification-message">{notification.message}</span>
                    <button
                        className="notification-close"
                        onClick={() => removeNotification(notification.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Notification;
