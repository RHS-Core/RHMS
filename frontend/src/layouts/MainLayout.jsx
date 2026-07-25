import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function MainLayout({ children }) {
  const location = useLocation();
  const { user } = useAuthContext();
  const hideSidebar = user?.role === 'SuperAdmin' || location.pathname.startsWith('/admin/');

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="flex min-w-0">
        {!hideSidebar && <Sidebar />}
        <main className="min-w-0 flex-1 w-full pb-8">{children}</main>
      </div>
    </div>
  );
}
