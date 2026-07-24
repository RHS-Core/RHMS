import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Đường dẫn Backend Node.js

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn đặt phòng:", error);
    throw error;
  }
};

export const getRooms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    throw error;
  }
};