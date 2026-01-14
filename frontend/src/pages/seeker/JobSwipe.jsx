import { useState, useEffect } from 'react';
import SwipeCard from '../../components/swipe/SwipeCard';
import JobCard from '../../components/swipe/JobCard';
import { useNotification } from '../../context/NotificationContext';
import jobApi from '../../api/jobApi';
import swipeApi from '../../api/swipeApi';
import './JobSwipe.css';

const JobSwipe = () => {
    const [jobs, setJobs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const { success, info, match, error } = useNotification();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await jobApi.getJobsForSwipe(page, 10);
            const jobData = response.content || response;
            setJobs(Array.isArray(jobData) ? jobData : []);
        } catch (err) {
            error('Failed to load jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const currentJob = jobs[currentIndex];
    const hasMoreJobs = currentIndex < jobs.length;

    const handleSwipeLeft = async () => {
        try {
            await swipeApi.swipeJob(currentJob.id, 'LEFT');
            info(`Skipped ${currentJob.title}`);
        } catch (err) {
            // Still move to next even if API fails
        }
        setCurrentIndex((prev) => prev + 1);
    };

    const handleSwipeRight = async () => {
        try {
            const response = await swipeApi.swipeJob(currentJob.id, 'RIGHT');
            if (response.isMatch) {
                match(`🎉 It's a match! ${currentJob.company?.name || 'Company'} is interested in you!`);
            } else {
                success(`Applied to ${currentJob.title} at ${currentJob.company?.name || 'Company'}`);
            }
        } catch (err) {
            error('Failed to apply');
        }
        setCurrentIndex((prev) => prev + 1);
    };

    const handleRefresh = () => {
        setCurrentIndex(0);
        setPage(0);
        fetchJobs();
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="loading-state">
                    <div className="spinner spinner-lg"></div>
                    <p>Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="swipe-page">
                <div className="swipe-header">
                    <h1 className="swipe-title">Find Your Dream Job</h1>
                    <p className="swipe-subtitle">
                        {hasMoreJobs
                            ? `${jobs.length - currentIndex} jobs waiting for you`
                            : 'You\'ve seen all available jobs'}
                    </p>
                </div>

                <div className="swipe-container">
                    {hasMoreJobs ? (
                        <>
                            {jobs.slice(currentIndex + 1, currentIndex + 3).map((job, index) => (
                                <div
                                    key={job.id}
                                    className="swipe-card-bg"
                                    style={{
                                        transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
                                        zIndex: -index - 1,
                                    }}
                                />
                            ))}

                            <SwipeCard
                                onSwipeLeft={handleSwipeLeft}
                                onSwipeRight={handleSwipeRight}
                            >
                                <JobCard job={currentJob} />
                            </SwipeCard>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon animate-float">🎯</div>
                            <h2 className="empty-state-title">You're all caught up!</h2>
                            <p className="empty-state-text">
                                You've swiped through all available jobs. Check back later for new opportunities!
                            </p>
                            <button onClick={handleRefresh} className="btn btn-primary">
                                <span>🔄</span> Refresh Jobs
                            </button>
                        </div>
                    )}
                </div>

                {hasMoreJobs && (
                    <div className="swipe-progress">
                        <span className="progress-text">
                            {currentIndex + 1} / {jobs.length}
                        </span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentIndex + 1) / jobs.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSwipe;
