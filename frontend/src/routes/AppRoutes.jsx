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
import Dashboard from '../pages/hotel/Dashboard.jsx';
import Rooms from '../pages/hotel/Rooms.jsx';
import Booking from '../pages/hotel/Booking.jsx';
import CheckIn from '../pages/hotel/CheckIn.jsx';
import CheckOut from '../pages/hotel/CheckOut.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

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

          <Route path="/" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/dashboard" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />

          <Route path="/rooms" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Rooms /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/rooms" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Rooms /></MainLayout></ProtectedRoute>} />

          <Route path="/booking" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Booking /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/booking" element={<ProtectedRoute allowedRoles={['Customer', 'HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><Booking /></MainLayout></ProtectedRoute>} />

          <Route path="/checkin" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><CheckIn /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/checkin" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><CheckIn /></MainLayout></ProtectedRoute>} />

          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><CheckOut /></MainLayout></ProtectedRoute>} />
          <Route path="/hotel/checkout" element={<ProtectedRoute allowedRoles={['HotelStaff', 'HotelManager', 'SuperAdmin']}><MainLayout><CheckOut /></MainLayout></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><MainLayout><SuperAdminDashboard /></MainLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
