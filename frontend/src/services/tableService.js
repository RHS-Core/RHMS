import apiClient from './apiClient.js';

export const getTables = async () => apiClient.get('/tables');
export const reserveTable = async (id, payload) => apiClient.post(`/tables/${id}/reserve`, payload);
export const updateTableStatus = async (id, payload) => apiClient.put(`/tables/${id}/status`, payload);
