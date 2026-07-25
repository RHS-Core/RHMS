import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function HotelSidebar() {
  const { user } = useAuthContext();
  const location = useLocation();

  if (['/portal', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const role = user?.role;

  // Kiểm tra quyền truy cập vào phân hệ Khách sạn
  if (!role || (!role.includes('Hotel') && role !== 'SuperAdmin' && role !== 'Customer')) {
    return null;
  }

  // 1. Menu cơ bản dành cho tất cả mọi người (kể cả Customer)
  const menuItems = [
    { label: 'Phòng', path: '/hotel/rooms', icon: 'bi-door-open' },
    { label: 'Đặt phòng', path: '/hotel/booking', icon: 'bi-calendar-check' },
  ];

  // 2. Thêm Check-in & Check-out chỉ cho Nhân viên / Quản lý / Admin
  if (role.includes('Hotel') || role === 'SuperAdmin') {
    menuItems.push(
      { label: 'Check-in', path: '/hotel/checkin', icon: 'bi-box-arrow-in-right' },
      { label: 'Check-out', path: '/hotel/checkout', icon: 'bi-box-arrow-right' }
    );
  }

  // 3. Mục Dịch vụ
  menuItems.push({ label: 'Dịch vụ', path: '/hotel/dashboard', icon: 'bi-stars' });

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden min-h-[calc(100vh-72px)] w-64 shrink-0 border-r border-slate-200 bg-emerald-950 text-white lg:block">
      <div className="p-4">
        <h3 className="mb-4 font-semibold tracking-wide">MENU KHÁCH SẠN</h3>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  isActive(item.path)
                    ? 'bg-emerald-500 text-white'
                    : 'text-emerald-100 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}