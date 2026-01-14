import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            type: 'info',
            duration: 4000,
            ...notification,
        };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto remove after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const success = useCallback((message, options = {}) => {
        return addNotification({ message, type: 'success', ...options });
    }, [addNotification]);

    const error = useCallback((message, options = {}) => {
        return addNotification({ message, type: 'error', ...options });
    }, [addNotification]);

    const warning = useCallback((message, options = {}) => {
        return addNotification({ message, type: 'warning', ...options });
    }, [addNotification]);

    const info = useCallback((message, options = {}) => {
        return addNotification({ message, type: 'info', ...options });
    }, [addNotification]);

    const match = useCallback((message, options = {}) => {
        return addNotification({ message, type: 'match', duration: 6000, ...options });
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
        match,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
