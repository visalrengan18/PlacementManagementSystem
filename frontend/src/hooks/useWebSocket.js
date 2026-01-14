import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const useWebSocket = (matchId, onMessage) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    // Keep the callback ref updated
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!matchId) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        // Prevent multiple connections
        if (clientRef.current) {
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            setConnected(true);
            client.subscribe(`/topic/chat.${matchId}`, (message) => {
                if (onMessageRef.current) {
                    onMessageRef.current(JSON.parse(message.body));
                }
            });
        };

        client.onDisconnect = () => {
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [matchId]); // Only depend on matchId, not onMessage

    const sendMessage = useCallback((content) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({ matchId, content }),
            });
        }
    }, [matchId]);

    return { connected, sendMessage };
};

export default useWebSocket;
