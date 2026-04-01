import axios from 'axios';

const api = axios.create({
    baseURL: `http://${window.location.hostname}:5000`,
});

// Add /api prefix to all requests if not already present
api.interceptors.request.use(
    (config) => {
        if (!config.url.startsWith('http') && !config.url.startsWith('/api')) {
            config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
        }
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;
        console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message);

        // SIMPLIFIED METHOD: Do not redirect to login page, just return the error gracefully.
        if (error.response?.status === 401) {
            console.warn('[API] Auth failed (401), but redirect is disabled for simple method.');
        }

        return Promise.reject(error);
    }
);

export default api;
