import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import swipeApi from '../../api/swipeApi';
import '../seeker/Matches.css';

const CompanyMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error } = useNotification();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await swipeApi.getCompanyMatches();
                setMatches(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load matches');
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    if (loading) {
        return <div className="page-container flex items-center justify-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="matches-page">
                <div className="page-header">
                    <h1>Your Matches 💕</h1>
                    <p className="text-muted">Candidates who matched with your job postings</p>
                </div>
                {matches.length > 0 ? (
                    <div className="matches-grid">
                        {matches.map((match) => (
                            <div key={match.id} className="match-card">
                                <div className="match-card-header">
                                    <div className="company-logo-match">{match.seeker?.name?.charAt(0) || 'S'}</div>
                                </div>
                                <div className="match-card-body">
                                    <h3>{match.seeker?.name || 'Candidate'}</h3>
                                    <p>{match.seeker?.title || 'Job Seeker'}</p>
                                    <span className="match-meta">For: {match.job?.title || 'Position'}</span>
                                </div>
                                <div className="match-card-footer">
                                    <span>{formatTimeAgo(match.matchedAt)}</span>
                                    <Link to={`/chat/${match.id}`} className="btn btn-primary btn-sm">💬 Chat</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">💕</div>
                        <h3>No matches yet</h3>
                        <p>Matches will appear here when you accept candidates who applied to your jobs.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyMatches;

