import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

/**
 * Custom hook for Socket.io real-time connection
 * @param {string} serverUrl - Backend server URL
 * @returns {Object} Socket connection data
 */
export const useSocket = (serverUrl) => {
    const [connected, setConnected] = useState(false);
    const [visitors, setVisitors] = useState([]);
    const [systemHealth, setSystemHealth] = useState(null);
    const [errorStats, setErrorStats] = useState(null);
    const [liveCount, setLiveCount] = useState(0);

    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize Socket.io connection
        const API_BASE = serverUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

        socketRef.current = io(API_BASE, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Socket.io connected');
            setConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket.io disconnected');
            setConnected(false);
        });

        socket.on('connected', (data) => {
            console.log('🔌 Server message:', data.message);
        });

        // Listen for new visitor events
        socket.on('visitor:new', (visitorData) => {
            console.log('👤 New visitor:', visitorData);
            setVisitors(prev => [visitorData, ...prev].slice(0, 50)); // Keep last 50
            setLiveCount(prev => prev + 1);

            // Reset live count after 30 seconds (assuming visitor is "active" for 30s)
            setTimeout(() => {
                setLiveCount(prev => Math.max(0, prev - 1));
            }, 30000);
        });

        // Listen for system health updates
        socket.on('system:health', (healthData) => {
            setSystemHealth(healthData);
        });

        // Listen for error stats updates
        socket.on('system:errors', (stats) => {
            setErrorStats(stats);
        });

        // Error handling
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [serverUrl]);

    return {
        connected,
        visitors,
        systemHealth,
        errorStats,
        liveCount,
        socket: socketRef.current
    };
};

export default useSocket;
