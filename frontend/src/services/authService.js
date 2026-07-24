import apiClient from './apiClient.js';

export const loginUser = async (payload) => apiClient.post('/auth/login', payload);
export const registerUser = async (payload) => apiClient.post('/auth/register', payload);
export const getProfile = async () => apiClient.get('/auth/me');
