import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import chatApi from '../../api/chatApi';
import useWebSocket from '../../hooks/useWebSocket';
import './Chat.css';

const ChatWindow = () => {
    const { matchId } = useParams();
    const { user } = useAuth();
    const { error } = useNotification();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatRoom, setChatRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const handleNewMessage = useCallback((message) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const { connected, sendMessage } = useWebSocket(matchId, handleNewMessage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomData, messagesData] = await Promise.all([
                    chatApi.getChatRoom(matchId),
                    chatApi.getMessages(matchId),
                ]);
                setChatRoom(roomData);
                setMessages(messagesData);
                await chatApi.markAsRead(matchId);
            } catch (err) {
                error('Failed to load chat');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [matchId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            if (connected) {
                sendMessage(newMessage);
            } else {
                const msg = await chatApi.sendMessage(matchId, newMessage);
                setMessages((prev) => [...prev, msg]);
            }
            setNewMessage('');
        } catch (err) {
            error('Failed to send message');
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <div className="page-container flex items-center justify-center"><div className="spinner spinner-lg"></div></div>;
    }

    return (
        <div className="page-container">
            <div className="chat-page">
                <div className="chat-header">
                    <Link to={user?.role === 'SEEKER' ? '/seeker/matches' : '/company/matches'} className="back-btn">← Back</Link>
                    <div className="chat-header-info">
                        <div className="chat-avatar">{chatRoom?.otherUserName?.charAt(0) || 'U'}</div>
                        <div>
                            <h2>{chatRoom?.otherUserName || 'Chat'}</h2>
                        </div>
                    </div>
                    <span className={`connection-status ${connected ? 'online' : 'offline'}`}>
                        {connected ? '● Online' : '○ Offline'}
                    </span>
                </div>

                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="no-messages">
                            <p>No messages yet. Say hello! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`message-bubble ${msg.senderId === user?.id ? 'own' : 'other'}`}>
                                <p className="message-content">{msg.content}</p>
                                <div className="message-meta">
                                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                                    {msg.senderId === user?.id && (
                                        <span className="message-status">
                                            {msg.status === 'READ' ? '✓✓' : msg.status === 'DELIVERED' ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="chat-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="chat-input"
                    />
                    <button type="submit" className="btn btn-primary send-btn" disabled={!newMessage.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
