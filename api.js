import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT token interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth endpoints
export const authAPI = {
    register: (name, email, password, phone) =>
        api.post('/auth/register', { name, email, password, phone }),
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
};

// Complaint endpoints
export const complaintAPI = {
    createComplaint: (formData) =>
        api.post('/complaints', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getAllComplaints: (params = {}) =>
        api.get('/complaints', { params }),
    getMyComplaints: () =>
        api.get('/complaints/my'),
};

// Admin endpoints
export const adminAPI = {
    getStats: () =>
        api.get('/admin/stats'),
    updateComplaintStatus: (id, status) =>
        api.put(`/admin/complaints/${id}/status`, { status }),
};

export default api;
