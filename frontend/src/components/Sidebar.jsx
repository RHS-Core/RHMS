import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function Sidebar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (['/portal', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin/')) {
        return null;
    }

    const role = user?.role;
    const menuItems = [];

    if (role === 'Customer') {
        menuItems.push(
            { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
            { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
        );
    }

    if (role === 'RestaurantStaff') {
        menuItems.push(
            { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
            { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
            { label: 'Gọi món & Thanh toán', path: '/restaurant/orders', icon: 'bi-cart-check' },
        );
    }

    if (role === 'RestaurantManager' || role === 'SuperAdmin') {
        menuItems.push(
            { label: 'Thực đơn', path: '/restaurant/menu', icon: 'bi-book' },
            { label: 'Sơ đồ Bàn & VIP', path: '/restaurant/tables', icon: 'bi-grid-3x3' },
            { label: 'Gọi món & Thanh toán', path: '/restaurant/orders', icon: 'bi-cart-check' },
            { label: 'Báo cáo Doanh thu', path: '/restaurant/dashboard', icon: 'bi-bar-chart' },
        );
    }

    if (!menuItems.length) {
        return null;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="hidden min-h-[calc(100vh-72px)] w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-white lg:block">
            <div className="p-4">
                <h3 className="mb-4 font-semibold tracking-wide">MENU ĐIỀU HƯỚNG</h3>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
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
        </aside>
    );
}