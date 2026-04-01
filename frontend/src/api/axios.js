import axios from 'axios';

const isVercel = window.location.hostname.includes('vercel.app');

const api = axios.create({
    baseURL: isVercel ? '' : `http://${window.location.hostname}:5000`,
});

// Intercept requests
api.interceptors.request.use(
    (config) => {
        // Vercel Offline Demo Mode: Redirect APIs to static JSON mock data!
        if (isVercel) {
            if (config.method.toLowerCase() === 'get') {
                let endpoint = config.url.replace('/api/', '').replace(/^\//, '');
                endpoint = endpoint.split('?')[0].split('/')[0];
                if (endpoint === 'auth') endpoint = 'success'; // edge case for GET auth
                config.url = `/mock/${endpoint}.json`;
            } else {
                // Simulate success for POST/PUT/DELETE
                config.method = 'get';
                config.url = `/mock/success.json`;
            }
            return config;
        }

        // Normal Production API routing
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

        if (error.response?.status === 401) {
            console.warn('[API] Auth failed (401), but redirect is disabled for simple method.');
        }

        return Promise.reject(error);
    }
);

export default api;
