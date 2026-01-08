import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data: any) => API.post('/login', data);
export const fetchEvents = (params?: any) => API.get('/events', { params });
export const createEvent = (data: any) => API.post('/events', data);
export const updateEvent = (id: string, data: any) => API.put(`/events/${id}`, data);
export const deleteEvent = (id: string) => API.delete(`/events/${id}`);

export default API;
