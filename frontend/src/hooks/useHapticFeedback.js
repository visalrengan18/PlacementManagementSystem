import { useCallback, useRef } from 'react';

/**
 * Custom hook for triggering haptic-style feedback animations
 * Returns a ref to attach to an element and a trigger function
 * 
 * Usage:
 * const { ref, triggerHaptic } = useHapticFeedback();
 * <button ref={ref} onClick={() => { doAction(); triggerHaptic(); }}>
 * 
 * @param {string} type - 'success' | 'pulse' | 'pop' (default: 'success')
 */
export const useHapticFeedback = (type = 'success') => {
    const ref = useRef(null);

    const triggerHaptic = useCallback(() => {
        const element = ref.current;
        if (!element) return;

        const className = `haptic-${type}`;

        // Remove class first to allow re-triggering
        element.classList.remove(className);

        // Force reflow to reset animation
        void element.offsetWidth;

        // Add class to trigger animation
        element.classList.add(className);

        // Remove class after animation completes
        const duration = type === 'pop' ? 250 : type === 'pulse' ? 300 : 400;
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }, [type]);

    return { ref, triggerHaptic };
};

/**
 * Trigger haptic feedback on any element by ID
 * @param {string} elementId - DOM element ID
 * @param {string} type - 'success' | 'pulse' | 'pop'
 */
export const triggerHapticById = (elementId, type = 'success') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const className = `haptic-${type}`;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    const duration = type === 'pop' ? 250 : type === 'pulse' ? 300 : 400;
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
};

export default useHapticFeedback;
