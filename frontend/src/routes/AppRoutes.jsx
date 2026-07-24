import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import PortalSelect from '../pages/PortalSelect.jsx';
import ManagerDashboard from '../pages/restaurant/ManagerDashboard.jsx';
import MenuPage from '../pages/restaurant/MenuPage.jsx';
import OrderBillingPage from '../pages/restaurant/OrderBillingPage.jsx';
import TableGridPage from '../pages/restaurant/TableGridPage.jsx';
import SuperAdminDashboard from '../pages/admin/SuperAdminDashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

const HotelDashboardPage = () => <div className="p-6">Hotel Dashboard</div>;
const HotelRoomsPage = () => <div className="p-6">Hotel Rooms</div>;
const HotelGridPage = () => <div className="p-6">Hotel Grid</div>;
const ForbiddenPage = () => <div className="p-6">403 Forbidden</div>;

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route path="/portal" element={<ProtectedRoute><MainLayout><PortalSelect /></MainLayout></ProtectedRoute>} />
          <Route path="/restaurant/menu" element={<ProtectedRoute allowedRoles={['Customer', 'RestaurantStaff', 'RestaurantManager', 'SuperAdmin']}><MainLayout><MenuPage /></MainLayout></ProtectedRoute>} />
          <Route path="/restaurant/tables" element={<ProtectedRoute allowedRoles={['RestaurantStaff', 'RestaurantManager', 'SuperAdmin', 'Customer']}><MainLayout><TableGridPage /></MainLayout></ProtectedRoute>} />
          <Route path="/restaurant/orders" element={<ProtectedRoute allowedRoles={['RestaurantStaff', 'RestaurantManager', 'SuperAdmin', 'Customer']}><MainLayout><OrderBillingPage /></MainLayout></ProtectedRoute>} />
          <Route path="/restaurant/dashboard" element={<ProtectedRoute allowedRoles={['RestaurantManager', 'SuperAdmin']}><MainLayout><ManagerDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/rooms" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><HotelRoomsPage /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/dashboard" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><HotelDashboardPage /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/grid" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><HotelGridPage /></MainLayout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><MainLayout><SuperAdminDashboard /></MainLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
