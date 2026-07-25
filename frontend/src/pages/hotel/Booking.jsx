import { useState, useEffect, useMemo } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';

const roomTypes = [
  { id: 'STANDARD', name: 'Standard (Thường)', price: 500000 },
  { id: 'SUPERIOR', name: 'Superior (Nâng cấp)', price: 800000 },
  { id: 'DELUXE', name: 'Deluxe (Cao cấp)', price: 1200000 },
  { id: 'VIP', name: 'VIP (Sang trọng)', price: 1800000 },
];

export default function RoomBookingPage() {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    roomType: 'STANDARD',
    checkIn: '',
    checkOut: '',
    note: '',
    paymentMethod: 'CASH',
  });

  const [toast, setToast] = useState('');

  // Tự động điền tên người dùng từ AuthContext nếu có
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || user.fullName || 'Mai Diễm',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Tính số đêm lưu trú
  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [form.checkIn, form.checkOut]);

  // Lấy giá của loại phòng đang chọn
  const selectedRoomPrice = useMemo(() => {
    const room = roomTypes.find((r) => r.id === form.roomType);
    return room ? room.price : 0;
  }, [form.roomType]);

  // Tổng tiền dự kiến
  const totalPrice = nights * selectedRoomPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nights <= 0) {
      setToast('⚠️ Ngày trả phòng phải sau ngày nhận phòng!');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    // Xử lý gửi API đặt phòng tại đây
    setToast('🎉 Đặt phòng thành công!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">Đặt Phòng Khách Sạn</h2>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          {/* Tên khách hàng */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Tên khách hàng</label>
            <input
              required
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Nhập họ và tên..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nhập số điện thoại..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Loại phòng */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Loại phòng</label>
            <select
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            >
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.price.toLocaleString('vi-VN')}đ / đêm
                </option>
              ))}
            </select>
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Thanh toán</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            >
              <option value="CASH">Thanh toán tại lễ tân</option>
              <option value="BANK">Chuyển khoản Ngân hàng / QR Code</option>
            </select>
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Ngày nhận phòng (Check-in)</label>
            <input
              required
              type="date"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Ngày trả phòng (Check-out)</label>
            <input
              required
              type="date"
              value={form.checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Ghi chú */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Ghi chú thêm</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Yêu cầu đặc biệt (ví dụ: phòng tầng cao, giường đôi...)"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Khung tổng kết chi phí */}
          <div className="rounded-xl bg-slate-50 p-4 md:col-span-2 border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-slate-600">
                Đơn giá: <span className="font-semibold text-slate-800">{selectedRoomPrice.toLocaleString('vi-VN')}đ / đêm</span>
              </p>
              <p className="text-sm text-slate-600">
                Số đêm ở: <span className="font-semibold text-slate-800">{nights} đêm</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-500">Tổng tiền dự kiến:</span>
              <div className="text-2xl font-bold text-blue-600">
                {totalPrice.toLocaleString('vi-VN')}đ
              </div>
            </div>
          </div>

          {/* Nút gửi */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Xác Nhận Đặt Phòng
            </button>
          </div>
        </form>
      </div>

      {/* Toast thông báo */}
      {toast && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}