import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track page views
 */
const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const trackVisit = async () => {
            try {
                const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
                await fetch(`${API_BASE}/api/system/visit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: location.pathname + location.search
                    })
                });
            } catch (error) {
                console.error('Tracking error:', error);
            }
        };

        // Small delay to ensure route change is complete
        const timeout = setTimeout(trackVisit, 500);

        return () => clearTimeout(timeout);
    }, [location]);
};

export default usePageTracking;
