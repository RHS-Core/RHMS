import apiClient from './apiClient.js';

export const getUsers = async () => apiClient.get('/users');
export const createUser = async (payload) => apiClient.post('/users/create', payload);
export const updateUserStatus = async (id, payload) => apiClient.patch(`/users/${id}/status`, payload);
