import apiClient from './apiClient.js';

export const getFoods = async () => apiClient.get('/foods');
export const createFood = async (payload) => apiClient.post('/foods', payload);
export const updateFood = async (id, payload) => apiClient.put(`/foods/${id}`, payload);
export const deleteFood = async (id) => apiClient.delete(`/foods/${id}`);
