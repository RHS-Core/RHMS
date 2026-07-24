import React, { useState } from 'react';

const Booking = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    roomType: 'Standard',
    checkInDate: '',
    checkOutDate: '',
    note: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đặt phòng:", formData);
    // TODO: Bổ sung gọi API Axios gửi về Backend ở bước sau
    alert("Tạo đơn đặt phòng thành công (Chờ kết nối Backend)!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Đặt Phòng Khách Sạn</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
            <input
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Standard">Standard (Thường)</option>
              <option value="VIP">VIP (Cao cấp)</option>
              <option value="Deluxe">Deluxe (Sang trọng)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Yêu cầu đặc biệt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng (Check-in)</label>
            <input
              type="date"
              name="checkInDate"
              required
              value={formData.checkInDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng (Check-out)</label>
            <input
              type="date"
              name="checkOutDate"
              required
              value={formData.checkOutDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Xác Nhận Đặt Phòng
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;