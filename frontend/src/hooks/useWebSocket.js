import { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const useWebSocket = (matchId, onMessage, onPresenceChange) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const onMessageRef = useRef(onMessage);
    const onPresenceChangeRef = useRef(onPresenceChange);

    // Keep the callback refs updated
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        onPresenceChangeRef.current = onPresenceChange;
    }, [onPresenceChange]);

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

            // Subscribe to chat
            client.subscribe(`/topic/chat.${matchId}`, (message) => {
                if (onMessageRef.current) {
                    onMessageRef.current(JSON.parse(message.body));
                }
            });

            // Subscribe to presence
            client.subscribe('/topic/presence', (message) => {
                if (onPresenceChangeRef.current) {
                    onPresenceChangeRef.current(JSON.parse(message.body));
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
    }, [matchId]);

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
