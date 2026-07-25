import React, { useState } from 'react';

const CheckIn = () => {
  // Dữ liệu mẫu mở rộng (có thêm số người, tiền cọc, ghi chú)
  const [bookingList, setBookingList] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      phone: '0987654321',
      roomNumber: '102',
      roomType: 'Standard',
      guestsCount: 2,
      deposit: '200.000đ',
      checkInDate: '2026-07-25',
      checkOutDate: '2026-07-27',
      note: 'Khách yêu cầu phòng tầng cao, view thoáng',
      status: 'Reserved'
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      phone: '0912345678',
      roomNumber: '201',
      roomType: 'VIP',
      guestsCount: 4,
      deposit: '500.000đ',
      checkInDate: '2026-07-25',
      checkOutDate: '2026-07-28',
      note: 'Check-in sớm lúc 12h trưa',
      status: 'Reserved'
    },
    {
      id: 3,
      customerName: 'Lê Văn C',
      phone: '0933557799',
      roomNumber: '305',
      roomType: 'Deluxe',
      guestsCount: 2,
      deposit: '300.000đ',
      checkInDate: '2026-07-25',
      checkOutDate: '2026-07-26',
      note: 'Không hút thuốc',
      status: 'Reserved'
    }
  ]);

  // State cho thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal xem chi tiết/xác nhận
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lọc danh sách theo từ khóa tìm kiếm (tên khách hoặc số phòng)
  const filteredList = bookingList.filter(item => 
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.roomNumber.includes(searchTerm) ||
    item.phone.includes(searchTerm)
  );

  // Mở modal chi tiết
  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Xử lý khi nhấn nút Xác nhận Check-in thực sự
  const handleConfirmCheckIn = () => {
    if (!selectedBooking) return;

    // Cập nhật lại danh sách (xóa khách đã check-in ra khỏi hàng đợi)
    setBookingList(bookingList.filter(item => item.id !== selectedBooking.id));
    setIsModalOpen(false);
    
    alert(`Thành công! Khách hàng ${selectedBooking.customerName} đã nhận Phòng ${selectedBooking.roomNumber}. Trạng thái phòng chuyển sang Đang sử dụng.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tiêu đề & Thống kê nhanh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Check-in Khách Sạn</h2>
          <p className="text-sm text-gray-500">Danh sách các khách hàng có lịch nhận phòng trong ngày</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-emerald-800 font-medium text-sm">
          ⏳ Đang chờ nhận: <span className="font-bold text-emerald-600">{bookingList.length}</span> đơn
        </div>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc */}
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
              <th className="p-4">Số Điện Thoại</th>
              <th className="p-4">Loại Phòng</th>
              <th className="p-4">Số Khách</th>
              <th className="p-4">Tiền Cọc</th>
              <th className="p-4">Thời Gian Ở</th>
              <th className="p-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-emerald-700">Phòng {item.roomNumber}</td>
                  <td className="p-4 font-medium text-gray-900">{item.customerName}</td>
                  <td className="p-4 text-gray-600">{item.phone}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                      {item.roomType}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.guestsCount} người</td>
                  <td className="p-4 text-gray-600 font-semibold">{item.deposit}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {item.checkInDate} ➔ {item.checkOutDate}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded transition"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 px-3 rounded transition shadow-sm"
                    >
                      Check-in ngay
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  Không tìm thấy đơn đặt phòng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL XÁC NHẬN CHI TIẾT CHECK-IN */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">Xác Nhận Check-in Phòng {selectedBooking.roomNumber}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <p className="text-gray-500 text-xs">Khách hàng</p>
                  <p className="font-bold text-gray-900 text-base">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Số điện thoại</p>
                  <p className="font-bold text-gray-900 text-base">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Loại phòng</p>
                  <p className="font-semibold text-emerald-700">{selectedBooking.roomType} (Phòng {selectedBooking.roomNumber})</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Số lượng khách</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.guestsCount} người</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Thời gian lưu trú</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.checkInDate} đến {selectedBooking.checkOutDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Tiền cọc trước</p>
                  <p className="font-semibold text-emerald-600">{selectedBooking.deposit}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-1">Ghi chú từ đơn đặt phòng:</p>
                <p className="italic bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-100">
                  "{selectedBooking.note || 'Không có ghi chú'}"
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">* Kiểm tra kỹ giấy tờ tùy thân của khách trước khi xác nhận.</span>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmCheckIn}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow"
                  >
                    Xác Nhận Nhận Phòng
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

export default CheckIn;