import { useEffect, useState } from 'react';

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    revenue: 125000000,
    bookings: 48,
    topDish: 'Bò nướng',
    occupancy: 72,
  });

  useEffect(() => {
    const timer = setTimeout(() => setStats((prev) => ({ ...prev, occupancy: 78 })), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Báo cáo Nhà hàng</h2>
          <p className="text-sm text-slate-500">Tổng quan doanh thu, đặt bàn và hiệu suất bán hàng.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Tổng doanh thu</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">{stats.revenue.toLocaleString('vi-VN')}₫</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Số lượt đặt bàn</p>
            <p className="mt-2 text-2xl font-semibold text-blue-600">{stats.bookings}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Món bán chạy nhất</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">{stats.topDish}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Tỷ lệ lấp đầy bàn</p>
            <p className="mt-2 text-2xl font-semibold text-rose-600">{stats.occupancy}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
