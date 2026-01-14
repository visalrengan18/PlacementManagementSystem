import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import chatApi from '../../api/chatApi';
import './Chat.css';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { error } = useNotification();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await chatApi.getChatRooms();
                setChats(Array.isArray(data) ? data : []);
            } catch (err) {
                error('Failed to load chats');
                setChats([]);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    if (loading) {
        return <div className="page-container flex items-center justify-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="chat-list-page">
                <div className="page-header">
                    <h1>💬 Messages</h1>
                    <p className="text-muted">Chat with your matches</p>
                </div>

                {chats.length > 0 ? (
                    <div className="chat-list">
                        {chats.map((chat) => (
                            <Link key={chat.id} to={`/chat/${chat.matchId}`} className="chat-list-item">
                                <div className="chat-list-avatar">{chat.otherUserName?.charAt(0) || 'U'}</div>
                                <div className="chat-list-info">
                                    <h3>{chat.otherUserName}</h3>
                                    <p className="chat-list-preview">{chat.lastMessage || 'No messages yet'}</p>
                                </div>
                                <div className="chat-list-meta">
                                    {chat.lastMessageTime && <span className="chat-list-time">{chat.lastMessageTime}</span>}
                                    {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">💬</div>
                        <h3>No conversations yet</h3>
                        <p>Match with someone to start chatting!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
