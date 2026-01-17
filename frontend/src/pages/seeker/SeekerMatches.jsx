import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import swipeApi from '../../api/swipeApi';
import './Matches.css';

const SeekerMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error } = useNotification();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const data = await swipeApi.getSeekerMatches();
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
        return (
            <div className="page-container flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="matches-page">
                <div className="page-header">
                    <h1>Your Matches 💕</h1>
                    <p className="text-muted">Companies that want to connect with you</p>
                </div>

                {matches.length > 0 ? (
                    <div className="matches-grid">
                        {matches.map((match) => (
                            <div key={match.id} className="match-card">
                                <div className="match-card-header">
                                    <Link to={`/profile/${match.company?.userId}`} className="company-logo-match no-underline text-inherit">
                                        {match.company?.name?.charAt(0) || 'C'}
                                    </Link>
                                    {!match.contacted && <span className="new-badge">New</span>}
                                </div>
                                <div className="match-card-body">
                                    <Link to={`/profile/${match.company?.userId}`} className="no-underline text-inherit hover:opacity-80">
                                        <h3>{match.company?.name || 'Company'}</h3>
                                    </Link>
                                    <p>{match.job?.title || 'Position'}</p>
                                    <span className="match-meta">{match.company?.location || ''}</span>
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
                        <p>Keep swiping! When a company accepts your application, you'll see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerMatches;
