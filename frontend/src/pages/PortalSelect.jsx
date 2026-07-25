import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function PortalSelect() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">RHMS Portal</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">Chọn phân hệ để tiếp tục</h2>
          <p className="mt-3 text-slate-600">Chào mừng, {user?.name || 'Khách hàng'}. Chọn nhanh khu vực bạn muốn truy cập.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/restaurant/menu')}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Nhà hàng</div>
            <h3 className="text-2xl font-semibold text-slate-900">Nhà hàng & Thực đơn</h3>
            <p className="mt-3 text-slate-600">Xem thực đơn, đặt món và theo dõi đơn hàng.</p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/hotel/rooms')}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Khách sạn</div>
            <h3 className="text-2xl font-semibold text-slate-900">Khách sạn & Đặt phòng</h3>
            <p className="mt-3 text-slate-600">Khám phá phòng, đặt phòng và quản lý lưu trú.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
