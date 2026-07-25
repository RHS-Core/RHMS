import apiClient from './apiClient.js';

export const getUsers = async () => apiClient.get('/users');
export const createUser = async (payload) => apiClient.post('/users/create', payload);
export const updateUserStatus = async (id, payload) => apiClient.patch(`/users/${id}/status`, payload);

export const resetUserPasswordApi = async (userId, newPassword) => {
	const response = await apiClient.patch(`/users/${userId}/reset-password`, { newPassword });
	return response.data;
};

export const deleteUserApi = async (userId) => {
	const response = await apiClient.delete(`/users/${userId}`);
	return response.data;
};

export const changeMyPasswordApi = async (oldPassword, newPassword) => {
	const response = await apiClient.patch('/users/change-my-password', { oldPassword, newPassword });
	return response.data;
};
