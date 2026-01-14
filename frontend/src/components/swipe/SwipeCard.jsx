import { useState, useRef } from 'react';
import './SwipeCard.css';

const SwipeCard = ({ children, onSwipeLeft, onSwipeRight, disabled = false }) => {
    const cardRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const startX = useRef(0);
    const startY = useRef(0);

    const handleDragStart = (clientX, clientY) => {
        if (disabled || isAnimating) return;
        setIsDragging(true);
        startX.current = clientX;
        startY.current = clientY;
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging || disabled || isAnimating) return;

        const deltaX = clientX - startX.current;
        const deltaY = clientY - startY.current;
        const rot = deltaX * 0.1;

        setPosition({ x: deltaX, y: deltaY });
        setRotation(rot);

        // Determine swipe direction indicator
        if (deltaX > 50) {
            setSwipeDirection('right');
        } else if (deltaX < -50) {
            setSwipeDirection('left');
        } else {
            setSwipeDirection(null);
        }
    };

    const handleDragEnd = () => {
        if (!isDragging || disabled || isAnimating) return;
        setIsDragging(false);

        const threshold = 100;

        if (position.x > threshold) {
            // Swipe right - Apply
            animateOffScreen('right');
            setTimeout(() => {
                onSwipeRight?.();
                resetCard();
            }, 300);
        } else if (position.x < -threshold) {
            // Swipe left - Skip
            animateOffScreen('left');
            setTimeout(() => {
                onSwipeLeft?.();
                resetCard();
            }, 300);
        } else {
            // Return to center
            resetCard();
        }
    };

    const animateOffScreen = (direction) => {
        setIsAnimating(true);
        const multiplier = direction === 'right' ? 1 : -1;
        setPosition({ x: multiplier * 500, y: 0 });
        setRotation(multiplier * 30);
    };

    const resetCard = () => {
        setPosition({ x: 0, y: 0 });
        setRotation(0);
        setSwipeDirection(null);
        setIsAnimating(false);
    };

    // Button handlers for swipe actions
    const handleButtonSwipe = (direction) => {
        if (disabled || isAnimating) return;
        animateOffScreen(direction);
        setTimeout(() => {
            if (direction === 'right') {
                onSwipeRight?.();
            } else {
                onSwipeLeft?.();
            }
            resetCard();
        }, 300);
    };

    // Mouse events
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleDragEnd();
        }
    };

    // Touch events
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    const cardStyle = {
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div className="swipe-card-wrapper">
            <div
                ref={cardRef}
                className={`swipe-card ${isDragging ? 'dragging' : ''} ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}
                style={cardStyle}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Swipe indicators */}
                <div className={`swipe-indicator swipe-indicator-right ${swipeDirection === 'right' ? 'visible' : ''}`}>
                    <span>APPLY ✓</span>
                </div>
                <div className={`swipe-indicator swipe-indicator-left ${swipeDirection === 'left' ? 'visible' : ''}`}>
                    <span>SKIP ✕</span>
                </div>

                {/* Card content */}
                <div className="swipe-card-content">
                    {children}
                </div>
            </div>

            {/* Action buttons */}
            <div className="swipe-actions">
                <button
                    className="swipe-btn swipe-btn-left"
                    onClick={() => handleButtonSwipe('left')}
                    disabled={disabled || isAnimating}
                >
                    <span>✕</span>
                </button>
                <button
                    className="swipe-btn swipe-btn-right"
                    onClick={() => handleButtonSwipe('right')}
                    disabled={disabled || isAnimating}
                >
                    <span>✓</span>
                </button>
            </div>
        </div>
    );
};

export default SwipeCard;
