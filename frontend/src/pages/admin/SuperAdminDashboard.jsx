import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUserStatus } from '../../services/userService.js';
import Button from '../../components/common/Button.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';

const ROLE_FILTERS = ['All', 'RestaurantManager', 'HotelManager', 'RestaurantStaff', 'HotelStaff', 'Customer'];
const QUICK_ACTIONS = [
  { label: 'Thực đơn Nhà hàng', path: '/restaurant/menu' },
  { label: 'Sơ đồ Bàn ăn', path: '/restaurant/tables' },
  { label: 'Danh sách Phòng', path: '/hotel/rooms' },
  { label: 'Sơ đồ Phòng', path: '/hotel/grid' },
];

const revenueData = {
  restaurant: 1823400,
  hotel: 1378200,
};

const statusStyles = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-rose-100 text-rose-700',
};

const initialForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'Customer',
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalRevenue = revenueData.restaurant + revenueData.hotel;
  const restaurantShare = totalRevenue ? Math.round((revenueData.restaurant / totalRevenue) * 100) : 0;
  const hotelShare = totalRevenue ? 100 - restaurantShare : 0;

  const filteredUsers = useMemo(() => {
    if (filterRole === 'All') return users;
    return users.filter((item) => item.role === filterRole);
  }, [users, filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error(error);
      setToast('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createUser(form);
      setModalOpen(false);
      setForm(initialForm);
      showToast('Tạo tài khoản mới thành công.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || 'Tạo tài khoản thất bại.';
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setSubmitting(true);
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateUserStatus(userId, { status: newStatus });
      showToast(`Tài khoản đã được ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'}.`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast('Cập nhật trạng thái thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-6 rounded-3xl bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">SuperAdmin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Xin chào, {user?.name || 'SuperAdmin'}</h1>
            <p className="mt-2 text-sm text-slate-500">Tổng quan hệ thống nhà hàng và khách sạn.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.path}
                type="button"
                onClick={() => navigate(action.path)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
              >
                <p className="text-sm text-slate-500">Chuyển tới</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Doanh thu tổng hợp</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</h2>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Cập nhật tháng này</div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Nhà hàng</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.restaurant)}</p>
                <p className="mt-2 text-sm text-slate-500">Món ăn + Phí dịch vụ</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Khách sạn</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.hotel)}</p>
                <p className="mt-2 text-sm text-slate-500">Tiền phòng + Dịch vụ</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">TỔNG HỢP</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</p>
                <p className="mt-2 text-sm text-slate-500">Tổng doanh thu hệ thống</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Tỷ trọng doanh thu</p>
                <p className="text-sm font-semibold text-slate-900">Nhà hàng {restaurantShare}% — Khách sạn {hotelShare}%</p>
              </div>
              <div className="space-y-3">
                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-4 rounded-full bg-emerald-500" style={{ width: `${restaurantShare}%` }} />
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-4 rounded-full bg-indigo-500" style={{ width: `${hotelShare}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quản lý & Cấp phát tài khoản</h2>
                <p className="mt-1 text-sm text-slate-500">Xem, lọc và thay đổi trạng thái người dùng.</p>
              </div>
              <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setModalOpen(true)}>
                Cấp tài khoản mới
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {ROLE_FILTERS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFilterRole(role)}
                  className={`rounded-full border px-4 py-2 text-sm ${filterRole === role ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Họ tên</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Username</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Role</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Trạng thái</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-500">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-slate-500">Đang tải dữ liệu người dùng...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-500">Không có người dùng phù hợp.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm text-slate-700">{item.name}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{item.username || '—'}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{item.email}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{item.role}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || 'bg-slate-100 text-slate-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, item.status)}
                            disabled={submitting}
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {item.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Bảng điều khiển nhanh</h2>
            <p className="mt-2 text-sm text-slate-500">Sử dụng các lối tắt để điều hướng nhanh giữa các phân hệ.</p>
            <div className="mt-6 grid gap-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.path}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <p className="text-sm text-slate-500">{action.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Thông tin người dùng</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Tên:</span> {user?.name}</p>
              <p><span className="font-semibold text-slate-900">Username:</span> {user?.username || '—'}</p>
              <p><span className="font-semibold text-slate-900">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-slate-900">Role:</span> {user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Cấp tài khoản mới</h3>
                <p className="mt-1 text-sm text-slate-500">Điền thông tin tài khoản để tạo mới.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 transition hover:text-slate-700">Đóng</button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Họ tên
                <input name="name" value={form.name} onChange={handleInput} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Username
                <input name="username" value={form.username} onChange={handleInput} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Email
                <input name="email" type="email" value={form.email} onChange={handleInput} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Mật khẩu ban đầu
                <input name="password" type="password" value={form.password} onChange={handleInput} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                Chọn Role
                <select name="role" value={form.role} onChange={handleInput} className="w-full rounded-2xl border border-slate-200 px-4 py-3" required>
                  <option value="Customer">Customer</option>
                  <option value="RestaurantStaff">RestaurantStaff</option>
                  <option value="RestaurantManager">RestaurantManager</option>
                  <option value="HotelStaff">HotelStaff</option>
                  <option value="HotelManager">HotelManager</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </label>
              <div className="sm:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700">Hủy</button>
                <button type="submit" disabled={submitting} className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-50">
                  {submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-3xl bg-slate-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
