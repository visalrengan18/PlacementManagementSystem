import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchApi, followApi, connectionApi, directChatApi } from '../../api/networkApi';
import './SearchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResults();
    }, [filter]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await searchApi.search(query, filter);
            setResults(response.data);
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResults();
    };

    const handleFollow = async (userId, isFollowing) => {
        try {
            if (isFollowing) {
                await followApi.unfollow(userId);
            } else {
                await followApi.follow(userId);
            }
            setResults(results.map(u =>
                u.id === userId ? { ...u, isFollowing: !isFollowing } : u
            ));
        } catch (err) {
            console.error('Follow action failed:', err);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await connectionApi.sendRequest(userId);
            setResults(results.map(u =>
                u.id === userId ? { ...u, connectionStatus: 'PENDING' } : u
            ));
        } catch (err) {
            console.error('Connection request failed:', err);
        }
    };

    const handleMessage = async (userId) => {
        try {
            const response = await directChatApi.getOrCreateChat(userId);
            navigate(`/chat/room/${response.data.id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
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
                                >
                                    {user.isFollowing ? 'Following' : 'Follow'}
                                </button>

                                {user.role === 'SEEKER' && (
                                    <button
                                        className={`btn-connect ${user.isConnected ? 'connected' : ''} ${user.connectionStatus === 'PENDING' ? 'pending' : ''}`}
                                        onClick={() => !user.isConnected && user.connectionStatus !== 'PENDING' && handleConnect(user.id)}
                                        disabled={user.isConnected || user.connectionStatus === 'PENDING'}
                                    >
                                        {user.isConnected ? 'Connected' : user.connectionStatus === 'PENDING' ? 'Pending' : 'Connect'}
                                    </button>
                                )}

                                <button
                                    className="btn-message"
                                    onClick={() => handleMessage(user.id)}
                                >
                                    💬
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
