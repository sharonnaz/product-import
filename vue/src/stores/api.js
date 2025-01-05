import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Set your API base URL here
});

// Add a request interceptor to include the Bearer token in headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Set Authorization header
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        console.log('Unauthorized, redirecting to login...');
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Clear token on unauthorized access
        window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
});

export default api;
