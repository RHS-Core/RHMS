import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function Navigation() {
  const { user } = useAuthContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Ẩn Navigation ở /portal và /login
  if (['/portal', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  // Menu items theo role
  const getMenuItems = () => {
    const role = user?.role;
    
    const baseItems = [];
    
    // Tất cả authenticated users
    if (role) {
      baseItems.push({ label: 'Cửa hàng', path: '/portal', icon: 'bi-shop' });
    }

    // Customer: Menu & Bàn
    if (role === 'Customer') {
      return [
        ...baseItems,
        { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
        { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
      ];
    }

    // RestaurantStaff: Menu, Bàn, Gọi món
    if (role === 'RestaurantStaff') {
      return [
        ...baseItems,
        { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
        { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
        { label: 'Gọi món & Thanh toán', path: '/restaurant/orders', icon: 'bi-cart-check' },
      ];
    }

    // RestaurantManager: Menu, Bàn, Gọi món, Dashboard, Báo cáo
    if (role === 'RestaurantManager') {
      return [
        ...baseItems,
        { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
        { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
        { label: 'Gọi món & Thanh toán', path: '/restaurant/orders', icon: 'bi-cart-check' },
        { label: 'Báo cáo Doanh thu', path: '/restaurant/dashboard', icon: 'bi-bar-chart' },
      ];
    }

    // SuperAdmin: Tất cả + Master Dashboard
    if (role === 'SuperAdmin') {
      return [
        ...baseItems,
        { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
        { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
        { label: 'Gọi món & Thanh toán', path: '/restaurant/orders', icon: 'bi-cart-check' },
        { label: 'Báo cáo Doanh thu', path: '/restaurant/dashboard', icon: 'bi-bar-chart' },
        { label: 'Master Dashboard', path: '/admin/dashboard', icon: 'bi-speedometer2' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-40 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-white lg:hidden"
      >
        <i className="bi bi-list"></i>
        Menu
      </button>

      {/* Navigation */}
      <nav className={`${isOpen ? 'block' : 'hidden'} fixed left-0 top-20 z-30 h-screen w-64 overflow-y-auto bg-slate-900 text-white lg:sticky lg:block lg:top-0 lg:h-auto`}>
        <div className="p-4">
          <h3 className="mb-4 font-semibold">MENU ĐIỀU HƯỚNG</h3>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-20 z-20 bg-black/50 lg:hidden"
        />
      )}
    </>
  );
}
