import React, { useEffect, useRef, useState } from 'react';
import './Confetti.css';

const Confetti = ({
    active = false,
    duration = 3000,
    particleCount = 100,
    onComplete = () => { }
}) => {
    const canvasRef = useRef(null);
    const [isActive, setIsActive] = useState(active);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    useEffect(() => {
        if (!isActive || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Gold-themed confetti colors
        const colors = [
            '#D4AF37', // Champagne Gold
            '#E5C56C', // Bright Gold
            '#B49026', // Antique Gold
            '#F3D078', // Light Gold
            '#FFFFFF', // White
            '#FFD700', // Pure Gold
        ];

        // Create particles
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                opacity: 1,
            });
        }

        let animationFrame;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Update position
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.rotation += particle.rotationSpeed;
                particle.velocityY += 0.05; // Gravity

                // Fade out near the end
                if (progress > 0.7) {
                    particle.opacity = 1 - ((progress - 0.7) / 0.3);
                }

                // Draw particle
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate((particle.rotation * Math.PI) / 180);
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;

                if (particle.shape === 'rect') {
                    ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            if (elapsed < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setIsActive(false);
                onComplete();
            }
        };

        animate();

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, duration, particleCount, onComplete]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="confetti-canvas"
            aria-hidden="true"
        />
    );
};

// Hook for triggering confetti
export const useConfetti = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    const triggerConfetti = () => {
        setShowConfetti(true);
    };

    const handleComplete = () => {
        setShowConfetti(false);
    };

    const ConfettiComponent = () => (
        <Confetti
            active={showConfetti}
            onComplete={handleComplete}
        />
    );

    return { triggerConfetti, ConfettiComponent, showConfetti };
};

export default Confetti;
