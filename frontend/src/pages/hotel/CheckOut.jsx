import React, { useState } from 'react';

const CheckOut = () => {
  // Dữ liệu mẫu các phòng đang có khách ở (Trạng thái Đang sử dụng)
  const [activeRooms, setActiveRooms] = useState([
    {
      id: 101,
      roomNumber: '101',
      customerName: 'Lê Văn C',
      checkInDate: '2026-07-23',
      daysStayed: 2,
      pricePerNight: 500000,
      totalAmount: 1000000,
      status: 'Occupied'
    },
    {
      id: 202,
      roomNumber: '202',
      customerName: 'Phạm Thị D',
      checkInDate: '2026-07-22',
      daysStayed: 3,
      pricePerNight: 1500000,
      totalAmount: 4500000,
      status: 'Occupied'
    }
  ]);

  // Xử lý khi bấm Trả phòng
  const handleCheckOut = (id, roomNumber, totalAmount) => {
    // Xóa phòng khỏi danh sách đang sử dụng
    setActiveRooms(activeRooms.filter(room => room.id !== id));

    // Thông báo (Sau này kết nối API sẽ chuyển phòng sang Màu xanh và tạo Hóa đơn thanh toán)
    alert(`Trả phòng ${roomNumber} thành công!\nTổng tiền thanh toán: ${totalAmount.toLocaleString('vi-VN')} VNĐ.\nTrạng thái phòng đã chuyển về Trống (Màu xanh).`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Sách Phòng Cần Check-out</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm font-semibold">
              <th className="p-4">Số Phòng</th>
              <th className="p-4">Tên Khách Hàng</th>
              <th className="p-4">Ngày Nhận Phòng</th>
              <th className="p-4">Số Đêm Ở</th>
              <th className="p-4">Giá/Đêm</th>
              <th className="p-4">Tạm Tính</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {activeRooms.length > 0 ? (
              activeRooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-red-600">Phòng {room.roomNumber}</td>
                  <td className="p-4 font-medium">{room.customerName}</td>
                  <td className="p-4">{room.checkInDate}</td>
                  <td className="p-4">{room.daysStayed} đêm</td>
                  <td className="p-4">{room.pricePerNight.toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 font-semibold text-blue-600">
                    {room.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCheckOut(room.id, room.roomNumber, room.totalAmount)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded transition duration-200"
                    >
                      Xác Nhận Check-out
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Hiện không có phòng nào đang sử dụng cần Check-out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckOut;