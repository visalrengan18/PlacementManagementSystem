import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchApi, followApi, connectionApi, directChatApi } from '../../api/networkApi';
import { useNotification } from '../../context/NotificationContext';
import './SearchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const { success, error: showError } = useNotification();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchResults();
    }, [filter]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await searchApi.search(query, filter);
            // The response is the axios data, so we need response.data or just response if intercepted
            const data = response.data || response;
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Search failed:', err);
            showError('Failed to load search results');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResults();
    };

    const handleFollow = async (userId, isFollowing) => {
        setActionLoading(prev => ({ ...prev, [`follow-${userId}`]: true }));
        try {
            if (isFollowing) {
                await followApi.unfollow(userId);
                success('Unfollowed successfully');
            } else {
                await followApi.follow(userId);
                success('Following!');
            }
            setResults(results.map(u =>
                u.id === userId ? { ...u, isFollowing: !isFollowing } : u
            ));
        } catch (err) {
            console.error('Follow action failed:', err);
            showError(err.message || 'Failed to update follow status');
        } finally {
            setActionLoading(prev => ({ ...prev, [`follow-${userId}`]: false }));
        }
    };

    const handleConnect = async (userId) => {
        setActionLoading(prev => ({ ...prev, [`connect-${userId}`]: true }));
        try {
            await connectionApi.sendRequest(userId);
            success('Connection request sent!');
            setResults(results.map(u =>
                u.id === userId ? { ...u, connectionStatus: 'PENDING' } : u
            ));
        } catch (err) {
            console.error('Connection request failed:', err);
            showError(err.message || 'Failed to send connection request');
        } finally {
            setActionLoading(prev => ({ ...prev, [`connect-${userId}`]: false }));
        }
    };

    const handleMessage = async (userId) => {
        setActionLoading(prev => ({ ...prev, [`message-${userId}`]: true }));
        try {
            const response = await directChatApi.getOrCreateChat(userId);
            const chatRoom = response.data || response;
            navigate(`/chat/room/${chatRoom.id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
            showError(err.message || 'Failed to start chat');
        } finally {
            setActionLoading(prev => ({ ...prev, [`message-${userId}`]: false }));
        }
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h1>🔍 Find People</h1>
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
                <div className="search-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'seeker' ? 'active' : ''}`}
                        onClick={() => setFilter('seeker')}
                    >
                        Seekers
                    </button>
                    <button
                        className={`filter-btn ${filter === 'company' ? 'active' : ''}`}
                        onClick={() => setFilter('company')}
                    >
                        Companies
                    </button>
                </div>
            </div>

            <div className="search-results">
                {loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <p>Searching...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <p>No users found. Try a different search.</p>
                    </div>
                ) : (
                    results.map(user => (
                        <div key={user.id} className="user-card">
                            <Link to={`/profile/${user.id}`} className="user-avatar no-underline text-inherit block hover:opacity-80">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </Link>
                            <div className="user-info">
                                <Link to={`/profile/${user.id}`} className="no-underline text-inherit hover:opacity-80">
                                    <h3 className="user-name">{user.name}</h3>
                                </Link>
                                {user.title && <p className="user-title">{user.title}</p>}
                                <div className="user-meta">
                                    <span className="user-role">{user.role}</span>
                                    {user.location && <span>📍 {user.location}</span>}
                                </div>
                            </div>
                            <div className="user-actions">
                                <button
                                    className={`btn-follow ${user.isFollowing ? 'following' : ''}`}
                                    onClick={() => handleFollow(user.id, user.isFollowing)}
                                    disabled={actionLoading[`follow-${user.id}`]}
                                >
                                    {actionLoading[`follow-${user.id}`] ? '...' : user.isFollowing ? 'Following' : 'Follow'}
                                </button>

                                {user.role === 'SEEKER' && (
                                    <button
                                        className={`btn-connect ${user.isConnected ? 'connected' : ''} ${user.connectionStatus === 'PENDING' ? 'pending' : ''}`}
                                        onClick={() => handleConnect(user.id)}
                                        disabled={user.isConnected || user.connectionStatus === 'PENDING' || actionLoading[`connect-${user.id}`]}
                                    >
                                        {actionLoading[`connect-${user.id}`] ? '...' : user.isConnected ? 'Connected' : user.connectionStatus === 'PENDING' ? 'Pending' : 'Connect'}
                                    </button>
                                )}

                                <button
                                    className="btn-message"
                                    onClick={() => handleMessage(user.id)}
                                    disabled={actionLoading[`message-${user.id}`]}
                                >
                                    {actionLoading[`message-${user.id}`] ? '...' : '💬'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchPage;
