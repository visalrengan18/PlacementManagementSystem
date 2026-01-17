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
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const handleNewMessage = useCallback((message) => {
        setMessages((prev) => [...prev, message]);
        // Scroll to bottom on new message
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, []);

    const { connected, sendMessage } = useWebSocket(matchId, handleNewMessage);

    const loadMessages = async (pageNum, isInitial = false) => {
        try {
            if (!isInitial) setIsFetchingMore(true);

            const messagesData = await chatApi.getMessages(matchId, pageNum);
            // API returns sorting by createdAt DESC (newest first)
            // We need to reverse to show oldest first (ASC)
            const newMessages = messagesData.content.reverse();

            if (isInitial) {
                setMessages(newMessages);
                setLoading(false);
                // Scroll to bottom on initial load
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
                }, 100);
            } else {
                setMessages((prev) => [...newMessages, ...prev]);
                setIsFetchingMore(false);
            }

            setHasMore(!messagesData.last);
        } catch (err) {
            error('Failed to load messages');
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const roomData = await chatApi.getChatRoom(matchId);
                setChatRoom(roomData);
                await loadMessages(0, true);
                setPage(0);
                await chatApi.markAsRead(matchId);
            } catch (err) {
                error('Failed to load chat');
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [matchId]);

    const handleScroll = async (e) => {
        const { scrollTop, scrollHeight } = e.target;
        if (scrollTop === 0 && hasMore && !isFetchingMore) {
            // Save current scroll height to restore position after loading
            const currentScrollHeight = scrollHeight;

            const nextPage = page + 1;
            setPage(nextPage);
            await loadMessages(nextPage);

            // Restore scroll position
            // We need to wait for DOM update to have new scrollHeight
            requestAnimationFrame(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - currentScrollHeight;
                }
            });
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            if (connected) {
                sendMessage(newMessage);
            } else {
                const msg = await chatApi.sendMessage(matchId, newMessage);
                setMessages((prev) => [...prev, msg]);
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

                <div
                    className="messages-container"
                    onScroll={handleScroll}
                    ref={messagesContainerRef}
                >
                    {isFetchingMore && (
                        <div className="loading-more">
                            <span className="spinner spinner-sm"></span> Loading history...
                        </div>
                    )}

                    {messages.length === 0 && !loading ? (
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
