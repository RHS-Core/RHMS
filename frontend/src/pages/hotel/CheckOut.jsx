import React, { useState } from 'react';

const CheckOut = () => {
  // Dữ liệu mẫu mở rộng có thêm dịch vụ phát sinh và tiền cọc
  const [activeRooms, setActiveRooms] = useState([
    {
      id: 101,
      roomNumber: '101',
      customerName: 'Lê Văn C',
      phone: '0933112233',
      checkInDate: '2026-07-23',
      daysStayed: 2,
      pricePerNight: 500000,
      serviceFee: 150000, // Tiền dịch vụ gọi thêm (nước ngọt, giặt ủi...)
      deposit: 200000,     // Tiền đã cọc trước đó
      status: 'Occupied'
    },
    {
      id: 202,
      roomNumber: '202',
      customerName: 'Phạm Thị D',
      phone: '0977889900',
      checkInDate: '2026-07-22',
      daysStayed: 3,
      pricePerNight: 1500000,
      serviceFee: 300000,
      deposit: 500000,
      status: 'Occupied'
    }
  ]);

  // State cho thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Modal tính tiền/thanh toán
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lọc danh sách phòng theo từ khóa tìm kiếm
  const filteredRooms = activeRooms.filter(room =>
    room.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomNumber.includes(searchTerm) ||
    room.phone.includes(searchTerm)
  );

  // Mở modal thanh toán
  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // Tính tổng tiền thanh toán cuối cùng (Tiền phòng + Dịch vụ - Tiền cọc)
  const calculateTotal = (room) => {
    const roomTotal = room.daysStayed * room.pricePerNight;
    return roomTotal + (room.serviceFee || 0) - (room.deposit || 0);
  };

  // Xử lý xác nhận trả phòng thành công
  const handleConfirmCheckOut = () => {
    if (!selectedRoom) return;

    setActiveRooms(activeRooms.filter(room => room.id !== selectedRoom.id));
    setIsModalOpen(false);

    const finalAmount = calculateTotal(selectedRoom);
    alert(`Thanh toán và Check-out thành công cho Phòng ${selectedRoom.roomNumber}!\nKhách cần thanh toán: ${finalAmount.toLocaleString('vi-VN')} VNĐ.\nTrạng thái phòng đã chuyển về Trống.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tiêu đề & Thống kê */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Check-out & Thanh Toán</h2>
          <p className="text-sm text-gray-500">Danh sách các phòng đang có khách ở chuẩn bị trả phòng</p>
        </div>
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-red-800 font-medium text-sm">
          🏨 Phòng đang có khách: <span className="font-bold text-red-600">{activeRooms.length}</span> phòng
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách, số điện thoại hoặc số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold">
              <th className="p-4">Số Phòng</th>
              <th className="p-4">Tên Khách Hàng</th>
              <th className="p-4">Ngày Nhận</th>
              <th className="p-4">Số Đêm Ở</th>
              <th className="p-4">Giá/Đêm</th>
              <th className="p-4">Dịch Vụ Phát Sinh</th>
              <th className="p-4">Tạm Tính</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const tempTotal = room.daysStayed * room.pricePerNight + room.serviceFee - room.deposit;
                return (
                  <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-red-600">Phòng {room.roomNumber}</td>
                    <td className="p-4 font-medium text-gray-900">{room.customerName}</td>
                    <td className="p-4 text-gray-600">{room.checkInDate}</td>
                    <td className="p-4 text-gray-600">{room.daysStayed} đêm</td>
                    <td className="p-4 text-gray-600">{room.pricePerNight.toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 text-gray-600">{room.serviceFee.toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 font-bold text-blue-600">
                      {tempTotal.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 px-4 rounded transition shadow-sm"
                      >
                        Thanh Toán & Check-out
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  Không tìm thấy phòng nào đang sử dụng cần Check-out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL HÓA ĐƠN & THANH TOÁN CHI TIẾT */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="bg-red-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">Hóa Đơn Thanh Toán - Phòng {selectedRoom.roomNumber}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-red-200 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Khách hàng:</span>
                  <span className="font-bold text-gray-900">{selectedRoom.customerName} ({selectedRoom.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Thời gian lưu trú:</span>
                  <span className="font-medium">{selectedRoom.daysStayed} đêm (Nhận từ {selectedRoom.checkInDate})</span>
                </div>
              </div>

              {/* Chi tiết bảng tiền */}
              <div className="border-t border-b py-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền phòng ({selectedRoom.daysStayed} đêm x {selectedRoom.pricePerNight.toLocaleString('vi-VN')}đ):</span>
                  <span className="font-medium">{(selectedRoom.daysStayed * selectedRoom.pricePerNight).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí dịch vụ phát sinh (Ăn uống, minibar...):</span>
                  <span className="font-medium">{selectedRoom.serviceFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Đã đặt cọc trước:</span>
                  <span className="font-medium">-{selectedRoom.deposit.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                <span className="font-bold text-gray-800 text-base">Tổng tiền khách cần thanh toán:</span>
                <span className="font-extrabold text-blue-700 text-xl">
                  {calculateTotal(selectedRoom).toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">* Kiểm tra kỹ tài sản phòng trước khi nhận tiền.</span>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmCheckOut}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow"
                  >
                    In Hóa Đơn & Xác Nhận Trả Phòng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;