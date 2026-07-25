import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

const menuItems = [
  { label: 'Phòng', path: '/hotel/rooms', icon: 'bi-door-open' },
  { label: 'Đặt phòng', path: '/hotel/booking', icon: 'bi-calendar-check' },
  { label: 'Dịch vụ', path: '/hotel/dashboard', icon: 'bi-stars' },
];

export default function HotelSidebar() {
  const { user } = useAuthContext();
  const location = useLocation();

  if (['/portal', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  if (!user?.role || !user.role.includes('Hotel') && user?.role !== 'SuperAdmin' && user?.role !== 'Customer') {
    return null;
  }

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