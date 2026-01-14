import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SwipeCard from '../../components/swipe/SwipeCard';
import ProfileCard from '../../components/swipe/ProfileCard';
import { useNotification } from '../../context/NotificationContext';
import jobApi from '../../api/jobApi';
import swipeApi from '../../api/swipeApi';
import '../seeker/JobSwipe.css';

const ApplicantSwipe = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { info, match, error } = useNotification();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await jobApi.getJobApplicants(jobId, 0, 50);
                const data = response.content || response;
                setApplicants(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load applicants');
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const currentApplicant = applicants[currentIndex];
    const hasMore = currentIndex < applicants.length;

    const handleSwipeLeft = async () => {
        try {
            await swipeApi.swipeApplicant(currentApplicant.id, 'LEFT');
            info(`Passed on ${currentApplicant.name}`);
        } catch (err) {
            // Continue anyway
        }
        setCurrentIndex((prev) => prev + 1);
    };

    const handleSwipeRight = async () => {
        try {
            const response = await swipeApi.swipeApplicant(currentApplicant.id, 'RIGHT');
            if (response.isMatch) {
                match(`🎉 It's a match! You and ${currentApplicant.name} matched!`);
            } else {
                info(`Accepted ${currentApplicant.name}`);
            }
        } catch (err) {
            error('Failed to process');
        }
        setCurrentIndex((prev) => prev + 1);
    };

    if (loading) {
        return <div className="page-container flex items-center justify-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="swipe-page">
                <div className="swipe-header">
                    <h1 className="swipe-title">Review Applicants</h1>
                    <p className="swipe-subtitle">{hasMore ? `${applicants.length - currentIndex} candidates to review` : 'All candidates reviewed'}</p>
                </div>
                <div className="swipe-container">
                    {hasMore ? (
                        <SwipeCard onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
                            <ProfileCard profile={currentApplicant} type="seeker" />
                        </SwipeCard>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">✅</div>
                            <h2 className="empty-state-title">All done!</h2>
                            <p className="empty-state-text">You've reviewed all applicants for this position.</p>
                        </div>
                    )}
                </div>
                {hasMore && (
                    <div className="swipe-progress">
                        <span className="progress-text">{currentIndex + 1} / {applicants.length}</span>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${((currentIndex + 1) / applicants.length) * 100}%` }} /></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantSwipe;
