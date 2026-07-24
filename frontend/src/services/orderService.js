import apiClient from './apiClient.js';

export const getOrders = async () => apiClient.get('/orders');
export const createOrder = async (payload) => apiClient.post('/orders', payload);
