import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const servicesList = [
  {
    id: 1,
    name: 'Giặt ủi cao cấp',
    category: 'Vệ sinh',
    price: 50000,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&q=80',
    description: 'Dịch vụ giặt sấy thơm tho, ủi phẳng lấy ngay trong ngày.',
  },
  {
    id: 2,
    name: 'Ăn sáng tại phòng',
    category: 'Ẩm thực',
    price: 120000,
    unit: 'suất',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80',
    description: 'Thực đơn ăn sáng đa dạng phục vụ tận giường từ 6:00 - 10:00.',
  },
  {
    id: 3,
    name: 'Dịch vụ Spa & Massage',
    category: 'Thư giãn',
    price: 350000,
    unit: 'lượt',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80',
    description: 'Massage body xông hơi đá nóng giúp thư giãn tối đa.',
  },
  {
    id: 4,
    name: 'Xe đưa đón sân bay',
    category: 'Di chuyển',
    price: 250000,
    unit: 'chuyến',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80',
    description: 'Xe 7 chỗ đời mới đưa đón tận nơi an toàn, đúng giờ.',
  },
];

export default function HotelDashboard() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  const handleOrderService = (serviceName) => {
    setToast(`✓ Đã đăng ký thành công dịch vụ: ${serviceName}`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">Dịch vụ & Tổng quan Khách sạn</h2>
          <p className="text-sm text-slate-500">
            Quản lý tổng quan phòng trống, lượt đặt phòng và các dịch vụ tiện ích.
          </p>
        </div>

        {/* 3 Thẻ Thống Kê / Quick Access */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Thẻ 1: Phòng trống */}
          <div 
            onClick={() => navigate('/hotel/rooms')}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Phòng Khách Sạn</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">8 Phòng trống</h3>
                <p className="mt-1 text-xs text-emerald-600 font-medium">Sẵn sàng đón khách</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-2xl">
                🏨
              </div>
            </div>
          </div>

          {/* Thẻ 2: Đặt phòng */}
          <div 
            onClick={() => navigate('/hotel/booking')}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Đặt Phòng Nhanh</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">15 Lượt đặt</h3>
                <p className="mt-1 text-xs text-blue-600 font-medium">Tạo đơn đặt phòng mới</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-2xl">
                📅
              </div>
            </div>
          </div>

          {/* Thẻ 3: Dịch vụ */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Dịch Vụ Khách Sạn</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">4 Dịch vụ</h3>
                <p className="mt-1 text-xs text-purple-600 font-medium">Sẵn sàng phục vụ</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 text-2xl">
                🛎️
              </div>
            </div>
          </div>
        </div>

        {/* Danh Sách Dịch Vụ Đi Kèm */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Danh Sách Dịch Vụ Đi Kèm</h3>
              <p className="text-sm text-slate-500">Đăng ký thêm các tiện ích để có trải nghiệm lưu trú tốt nhất.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-slate-100">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {service.category}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-slate-800">{service.name}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{service.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="mb-3 text-sm font-bold text-blue-600">
                    {service.price.toLocaleString('vi-VN')}đ / {service.unit}
                  </div>
                  <button
                    onClick={() => handleOrderService(service.name)}
                    className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Đặt Dịch Vụ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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