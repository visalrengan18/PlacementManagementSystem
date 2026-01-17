import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { followApi, connectionApi, directChatApi } from '../../api/networkApi';
import './NetworkPage.css';

const NetworkPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('connections');
    const [connections, setConnections] = useState([]);
    const [pending, setPending] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'connections':
                    const connRes = await connectionApi.getConnections();
                    setConnections(connRes.data);
                    break;
                case 'pending':
                    const pendRes = await connectionApi.getPending();
                    setPending(pendRes.data);
                    break;
                case 'followers':
                    const followerRes = await followApi.getFollowers();
                    setFollowers(followerRes.data);
                    break;
                case 'following':
                    const followingRes = await followApi.getFollowing();
                    setFollowing(followingRes.data);
                    break;
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await connectionApi.accept(id);
            setPending(pending.filter(c => c.id !== id));
            fetchData();
        } catch (err) {
            console.error('Failed to accept:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await connectionApi.reject(id);
            setPending(pending.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to reject:', err);
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

    const handleUnfollow = async (userId) => {
        try {
            await followApi.unfollow(userId);
            setFollowing(following.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Failed to unfollow:', err);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="empty-state"><p>Loading...</p></div>;
        }

        switch (activeTab) {
            case 'connections':
                return connections.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🤝</div>
                        <p>No connections yet. Search for people to connect!</p>
                    </div>
                ) : (
                    connections.map(c => (
                        <div key={c.id} className="connection-card">
                            <Link to={`/profile/${c.user?.id}`} className="connection-avatar no-underline text-inherit block hover:opacity-80">
                                {c.user?.name?.charAt(0) || '?'}
                            </Link>
                            <div className="connection-info">
                                <Link to={`/profile/${c.user?.id}`} className="no-underline text-inherit hover:opacity-80">
                                    <h3 className="connection-name">{c.user?.name}</h3>
                                </Link>
                                <p className="connection-title">{c.user?.title || c.user?.role}</p>
                            </div>
                            <div className="connection-actions">
                                <button className="btn-sm btn-message" onClick={() => handleMessage(c.user?.id)}>
                                    💬 Message
                                </button>
                            </div>
                        </div>
                    ))
                );

            case 'pending':
                return pending.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <p>No pending requests</p>
                    </div>
                ) : (
                    pending.map(c => (
                        <div key={c.id} className="connection-card">
                            <Link to={`/profile/${c.user?.id}`} className="connection-avatar no-underline text-inherit block hover:opacity-80">
                                {c.user?.name?.charAt(0) || '?'}
                            </Link>
                            <div className="connection-info">
                                <Link to={`/profile/${c.user?.id}`} className="no-underline text-inherit hover:opacity-80">
                                    <h3 className="connection-name">{c.user?.name}</h3>
                                </Link>
                                <p className="connection-title">{c.user?.title || 'Seeker'}</p>
                            </div>
                            <div className="connection-actions">
                                <button className="btn-sm btn-accept" onClick={() => handleAccept(c.id)}>
                                    ✓ Accept
                                </button>
                                <button className="btn-sm btn-reject" onClick={() => handleReject(c.id)}>
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                );

            case 'followers':
                return followers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <p>No followers yet</p>
                    </div>
                ) : (
                    followers.map(u => (
                        <div key={u.id} className="connection-card">
                            <Link to={`/profile/${u.id}`} className="connection-avatar no-underline text-inherit block hover:opacity-80">
                                {u.name?.charAt(0) || '?'}
                            </Link>
                            <div className="connection-info">
                                <Link to={`/profile/${u.id}`} className="no-underline text-inherit hover:opacity-80">
                                    <h3 className="connection-name">{u.name}</h3>
                                </Link>
                                <p className="connection-title">{u.title || u.role}</p>
                            </div>
                            <div className="connection-actions">
                                <button className="btn-sm btn-message" onClick={() => handleMessage(u.id)}>
                                    💬
                                </button>
                            </div>
                        </div>
                    ))
                );

            case 'following':
                return following.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">➕</div>
                        <p>You're not following anyone yet</p>
                    </div>
                ) : (
                    following.map(u => (
                        <div key={u.id} className="connection-card">
                            <Link to={`/profile/${u.id}`} className="connection-avatar no-underline text-inherit block hover:opacity-80">
                                {u.name?.charAt(0) || '?'}
                            </Link>
                            <div className="connection-info">
                                <Link to={`/profile/${u.id}`} className="no-underline text-inherit hover:opacity-80">
                                    <h3 className="connection-name">{u.name}</h3>
                                </Link>
                                <p className="connection-title">{u.title || u.role}</p>
                            </div>
                            <div className="connection-actions">
                                <button className="btn-sm btn-reject" onClick={() => handleUnfollow(u.id)}>
                                    Unfollow
                                </button>
                                <button className="btn-sm btn-message" onClick={() => handleMessage(u.id)}>
                                    💬
                                </button>
                            </div>
                        </div>
                    ))
                );
        }
    };

    return (
        <div className="network-page">
            <div className="network-header">
                <h1>🌐 My Network</h1>
                <div className="network-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('connections')}
                    >
                        Connections <span className="count">{connections.length}</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending <span className="count">{pending.length}</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('followers')}
                    >
                        Followers
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
                        onClick={() => setActiveTab('following')}
                    >
                        Following
                    </button>
                </div>
            </div>

            <div className="network-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default NetworkPage;
