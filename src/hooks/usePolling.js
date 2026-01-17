// Custom hook for polling API endpoints (replaces Socket.IO)
import { useState, useEffect } from 'react';

export function usePolling(url, interval = 5000) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeoutId;

        const fetchData = async () => {
            try {
                const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
                const response = await fetch(`${API_BASE}${url}`);
                const json = await response.json();

                setData(json.data || json);
                setError(null);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling
        const startPolling = () => {
            timeoutId = setTimeout(() => {
                fetchData();
                startPolling(); // Recursive polling
            }, interval);
        };

        startPolling();

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [url, interval]);

    return { data, error, loading };
}

export default usePolling;
