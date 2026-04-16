import axios from 'axios';

// Always enable Demo Mode on Vercel
const isVercel = window.location.hostname.includes('vercel.app');

const api = axios.create({
    baseURL: isVercel ? '' : `http://${window.location.hostname}:5000` // Fallback to live server if local
});

// Polyfill adapter for FULL interactive capability (Add/Edit/Delete products/customers natively in browser cache)
if (isVercel) {
    api.defaults.adapter = async (config) => {
        // Parse the endpoint (e.g., /api/products -> 'products')
        let fullUrl = config.url.replace('/api/', '').replace(/^\//, '');
        const endpointParts = fullUrl.split('?')[0].split('/');
        let table = endpointParts[0] === 'auth' ? 'success' : endpointParts[0];
        const resourceId = endpointParts[1];
        const method = config.method.toLowerCase();
        
        let data = [];
        try {
            const cacheKey = `unity_erp_mock_${table}`;
            // 1. Check if we have an interactive local memory snapshot
            const cached = localStorage.getItem(cacheKey);
            if (!cached) {
                // 2. First time loading: Read the massive JSON snapshot we generated!
                const res = await fetch(`/mock/${table}.json`);
                if (res.ok) {
                    data = await res.json();
                    localStorage.setItem(cacheKey, JSON.stringify(data)); // Cache it!
                } else if (table === 'success') {
                    data = { success: true, token: 'demo-token', message: 'Demo success' };
                }
            } else {
                data = JSON.parse(cached); // Load current memory snapshot including user additions
            }
        } catch(e) { }

        let responseData = null;

        // Process request locally!
        if (method === 'get') {
            if (resourceId) {
                // Return single object
                responseData = Array.isArray(data) ? data.find(i => i.id == resourceId) : data;
            } else {
                // Full dataset mapping
                responseData = data;
            }
        } 
        else if (method === 'post') {
            // "Add Product / Customer" Simulation
            const newItem = { 
                ...(typeof config.data === 'string' ? JSON.parse(config.data) : config.data), 
                id: Math.floor(Math.random()*1000000), 
                createdAt: new Date().toISOString() 
            };
            if (Array.isArray(data)) {
                data.unshift(newItem); // Add to top of list
                localStorage.setItem(`unity_erp_mock_${table}`, JSON.stringify(data));
            }
            responseData = newItem;
        } 
        else if (method === 'put') {
            if (Array.isArray(data)) {
                const index = data.findIndex(i => i.id == resourceId);
                if (index !== -1) {
                    data[index] = { ...data[index], ...(typeof config.data === 'string' ? JSON.parse(config.data) : config.data) };
                    localStorage.setItem(`unity_erp_mock_${table}`, JSON.stringify(data));
                    responseData = data[index];
                }
            }
        } 
        else if (method === 'delete') {
            if (Array.isArray(data)) {
                data = data.filter(i => i.id != resourceId);
                localStorage.setItem(`unity_erp_mock_${table}`, JSON.stringify(data));
            }
            responseData = { success: true, message: 'Deleted' };
        }

        // Return a mock Axios-compatible response object
        return {
            data: responseData || [],
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
        };
    };
} else {
    // Normal Local Environment - Force normal /api/ URLs
    api.interceptors.request.use((config) => {
        if (!config.url.startsWith('http') && !config.url.startsWith('/api')) {
            config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
        }
        return config;
    });
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.message);
        return Promise.reject(error);
    }
);

export default api;
