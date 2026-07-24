import React, { useState } from 'react';

const CheckIn = () => {
  // Dữ liệu mẫu danh sách các phòng đã đặt trước (chờ check-in)
  const [bookingList, setBookingList] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      phone: '0987654321',
      roomNumber: '102',
      roomType: 'Standard',
      checkInDate: '2026-07-25',
      checkOutDate: '2026-07-27',
      status: 'Reserved' // Đã đặt trước
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      phone: '0912345678',
      roomNumber: '201',
      roomType: 'VIP',
      checkInDate: '2026-07-25',
      checkOutDate: '2026-07-28',
      status: 'Reserved'
    }
  ]);

  // Xử lý khi nhấn nút Check-in
  const handleCheckIn = (id, roomNumber) => {
    // Cập nhật lại danh sách (xóa khỏi danh sách chờ check-in)
    setBookingList(bookingList.filter(item => item.id !== id));
    
    // Thông báo (Sau này kết nối API sẽ gọi PUT /api/rooms/status để đổi màu phòng sang Đỏ)
    alert(`Xác nhận Check-in thành công cho Phòng ${roomNumber}! Trạng thái phòng đã chuyển sang Đang sử dụng (Màu đỏ).`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Sách Chờ Check-in</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm font-semibold">
              <th className="p-4">Số Phòng</th>
              <th className="p-4">Tên Khách Hàng</th>
              <th className="p-4">Số Điện Thoại</th>
              <th className="p-4">Loại Phòng</th>
              <th className="p-4">Ngày Tra Phòng</th>
              <th className="p-4">Trạng Thái</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.length > 0 ? (
              bookingList.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-blue-600">Phòng {item.roomNumber}</td>
                  <td className="p-4 font-medium">{item.customerName}</td>
                  <td className="p-4">{item.phone}</td>
                  <td className="p-4">{item.roomType}</td>
                  <td className="p-4">{item.checkOutDate}</td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">
                      Chờ nhận phòng
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCheckIn(item.id, item.roomNumber)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded transition duration-200"
                    >
                      Xác Nhận Check-in
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Hiện không có đơn đặt phòng nào chờ Check-in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckIn;