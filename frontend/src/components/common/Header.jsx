import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import Button from './Button.jsx';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/portal');
    }
  };

  const handleSwitchPortal = () => {
    if (user?.role === 'SuperAdmin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/portal');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex min-h-[72px] max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            ← Quay lại
          </button>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? 'Người dùng'}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{user?.role ?? 'Không xác định'}</span>
              <span className="text-slate-500">{user?.email ?? ''}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Customer', 'SuperAdmin'].includes(user?.role) && (
            <Button onClick={handleSwitchPortal} className="bg-slate-800 hover:bg-slate-900">Chuyển phân hệ</Button>
          )}
          <Button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700">Đăng xuất</Button>
        </div>
      </div>
    </header>
  );
}
