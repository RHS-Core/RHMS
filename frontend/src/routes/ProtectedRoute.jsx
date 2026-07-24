import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'SuperAdmin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'RestaurantManager') return <Navigate to="/restaurant/dashboard" replace />;
    if (user?.role === 'HotelManager') return <Navigate to="/hotel/dashboard" replace />;
    if (user?.role === 'RestaurantStaff') return <Navigate to="/restaurant/orders" replace />;
    if (user?.role === 'HotelStaff') return <Navigate to="/hotel/rooms" replace />;
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
