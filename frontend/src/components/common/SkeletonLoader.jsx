import React from 'react';
import './SkeletonLoader.css';

// Base Skeleton component with shimmer effect
export const Skeleton = ({ className = '', style = {} }) => (
    <div className={`skeleton ${className}`} style={style} />
);

// Text line skeleton
export const SkeletonText = ({ lines = 1, width = '100%' }) => (
    <div className="skeleton-text-container">
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                className="skeleton-text"
                style={{
                    width: i === lines - 1 && lines > 1 ? '70%' : width,
                    animationDelay: `${i * 0.1}s`
                }}
            />
        ))}
    </div>
);

// Avatar/Circle skeleton
export const SkeletonAvatar = ({ size = 48 }) => (
    <Skeleton
        className="skeleton-avatar"
        style={{ width: size, height: size }}
    />
);

// Card skeleton
export const SkeletonCard = ({ height = 200 }) => (
    <div className="skeleton-card" style={{ height }}>
        <div className="skeleton-card-header">
            <SkeletonAvatar size={50} />
            <div className="skeleton-card-header-text">
                <SkeletonText width="60%" />
                <SkeletonText width="40%" />
            </div>
        </div>
        <div className="skeleton-card-body">
            <SkeletonText lines={3} />
        </div>
        <div className="skeleton-card-footer">
            <Skeleton className="skeleton-button" style={{ width: '30%' }} />
            <Skeleton className="skeleton-button" style={{ width: '30%' }} />
        </div>
    </div>
);

// Stat card skeleton (for dashboard)
export const SkeletonStatCard = () => (
    <div className="skeleton-stat-card">
        <Skeleton className="skeleton-icon" />
        <div className="skeleton-stat-content">
            <Skeleton className="skeleton-stat-number" />
            <Skeleton className="skeleton-stat-label" />
        </div>
    </div>
);

// Button skeleton
export const SkeletonButton = ({ width = 120 }) => (
    <Skeleton className="skeleton-button" style={{ width }} />
);

// Job/Application list item skeleton
export const SkeletonListItem = () => (
    <div className="skeleton-list-item">
        <SkeletonAvatar size={44} />
        <div className="skeleton-list-content">
            <SkeletonText width="50%" />
            <SkeletonText width="80%" />
        </div>
        <Skeleton className="skeleton-badge" />
    </div>
);

// Full page loading skeleton
export const SkeletonPage = () => (
    <div className="skeleton-page">
        <div className="skeleton-page-header">
            <SkeletonText width="30%" />
        </div>
        <div className="skeleton-stats-grid">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
        </div>
        <div className="skeleton-content">
            <SkeletonCard height={180} />
            <SkeletonCard height={180} />
        </div>
    </div>
);

export default {
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonCard,
    SkeletonStatCard,
    SkeletonButton,
    SkeletonListItem,
    SkeletonPage
};
