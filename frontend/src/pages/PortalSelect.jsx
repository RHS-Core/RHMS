import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';

export default function PortalSelect() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">RHMS Portal</h1>
            <p className="text-sm text-slate-500">Chào mừng, {user?.name || 'Khách hàng'}</p>
          </div>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-800">Chọn phân hệ để tiếp tục</h2>
          <p className="mt-2 text-slate-500">Bạn có thể truy cập nhanh vào Nhà hàng hoặc Khách sạn.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h3 className="text-xl font-semibold">Nhà hàng & Thực đơn</h3>
            <p className="mt-3 text-slate-500">Xem thực đơn, đặt món và theo dõi đơn hàng.</p>
            <Button className="mt-6" onClick={() => navigate('/restaurant/menu')}>Đi tới Nhà hàng</Button>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h3 className="text-xl font-semibold">Khách sạn & Đặt phòng</h3>
            <p className="mt-3 text-slate-500">Khám phá phòng, đặt phòng và quản lý lưu trú.</p>
            <Button className="mt-6" onClick={() => navigate('/hotel/rooms')}>Đi tới Khách sạn</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
