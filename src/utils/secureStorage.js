/**
 * Secure Storage Utility
 * Prevents XSS-based token theft with additional security layers
 */

const STORAGE_KEY_PREFIX = '__secure_';
const TOKEN_EXPIRY_KEY = '__token_expiry';

export const secureStorage = {
    /**
     * Store admin token with expiry timestamp
     */
    setToken: (token, expiryHours = 24) => {
        try {
            const expiry = Date.now() + (expiryHours * 60 * 60 * 1000);
            localStorage.setItem(`${STORAGE_KEY_PREFIX}adminToken`, token);
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${TOKEN_EXPIRY_KEY}`, expiry.toString());
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    },

    /**
     * Get admin token (returns null if expired)
     */
    getToken: () => {
        try {
            const token = localStorage.getItem(`${STORAGE_KEY_PREFIX}adminToken`);
            const expiry = localStorage.getItem(`${STORAGE_KEY_PREFIX}${TOKEN_EXPIRY_KEY}`);

            if (!token || !expiry) return null;

            // Check if token expired
            if (Date.now() > parseInt(expiry)) {
                secureStorage.removeToken();
                return null;
            }

            return token;
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            return null;
        }
    },

    /**
     * Remove admin token
     */
    removeToken: () => {
        try {
            localStorage.removeItem(`${STORAGE_KEY_PREFIX}adminToken`);
            localStorage.removeItem(`${STORAGE_KEY_PREFIX}${TOKEN_EXPIRY_KEY}`);
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    },

    /**
     * Check if token exists and is valid
     */
    hasValidToken: () => {
        return secureStorage.getToken() !== null;
    }
};

export default secureStorage;
