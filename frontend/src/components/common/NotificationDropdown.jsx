import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext'; // specific hook
import notificationApi from '../../api/notificationApi';
import './NotificationDropdown.css';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

const NotificationDropdown = () => {
    const { isAuthenticated, user } = useAuth();
    const { info } = useNotification();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const clientRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            // Initial fetch
            fetchNotifications();

            // Setup WebSocket
            const token = localStorage.getItem('token');
            if (token && user?.id) {
                const client = new Client({
                    webSocketFactory: () => new SockJS(WS_URL),
                    connectHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                });

                client.onConnect = () => {
                    client.subscribe(`/topic/notifications/${user.id}`, (message) => {
                        const notification = JSON.parse(message.body);
                        handleNewNotification(notification);
                    });
                };

                client.activate();
                clientRef.current = client;
            }

            return () => {
                if (clientRef.current) {
                    clientRef.current.deactivate();
                    clientRef.current = null;
                }
            };
        }
    }, [isAuthenticated, user]);

    const handleNewNotification = (notification) => {
        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [notification, ...prev]);

        // Show toast
        info(notification.title + ": " + notification.message, { duration: 5000 });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationApi.getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to fetch unread count');
        }
    };

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleToggle = () => {
        // No need to fetch on toggle anymore as we keep it updated via WS + initial fetch
        // But we can refresh to be safe or if WS failed
        if (!isOpen) {
            // maybe refresh just in case?
            fetchNotifications();
            fetchUnreadCount();
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await notificationApi.markAsRead(notification.id);
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
            );
        }

        // Navigate based on notification type
        const routes = {
            MATCH: '/seeker/matches',
            MESSAGE: `/chat/room/${notification.relatedId}`,
            APPLICATION: `/company/applicants/${notification.relatedId}`,
            APPLICATION_STATUS: '/seeker/applications',
            PROFILE_VIEW: '/seeker/views',
        };

        const route = routes[notification.type];
        if (route) {
            navigate(route);
            setIsOpen(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        await notificationApi.markAllAsRead();
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        const icons = {
            MATCH: '💕',
            MESSAGE: '💬',
            APPLICATION: '📄',
            APPLICATION_STATUS: '📋',
            PROFILE_VIEW: '👀',
        };
        return icons[type] || '🔔';
    };

    const getIconClass = (type) => {
        const classes = {
            MATCH: 'match',
            MESSAGE: 'message',
            APPLICATION: 'application',
            APPLICATION_STATUS: 'status',
            PROFILE_VIEW: 'view',
        };
        return classes[type] || '';
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (!isAuthenticated) return null;

    return (
        <div className="notification-dropdown" ref={dropdownRef}>
            <button className="notification-btn" onClick={handleToggle}>
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className={`notification-icon ${getIconClass(n.type)}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="notification-content">
                                        <p className="notification-title">{n.title}</p>
                                        <p className="notification-message">{n.message}</p>
                                        <span className="notification-time">{formatTime(n.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="notification-empty">
                                <div className="notification-empty-icon">🔔</div>
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
