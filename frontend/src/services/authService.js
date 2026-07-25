import axios from 'axios';

const authClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

export const loginUser = async (payload) => authClient.post('/auth/login', payload);
export const registerUser = async (payload) => authClient.post('/auth/register', payload);
export const getProfile = async () => authClient.get('/auth/me');
