import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { createUser, deleteUserApi, getUsers, resetUserPasswordApi, updateUserStatus } from '../../services/userService.js';

const ROLE_FILTERS = ['All', 'RestaurantManager', 'HotelManager', 'RestaurantStaff', 'HotelStaff', 'Customer'];
const QUICK_ACTIONS = [
  { icon: 'Utensils', link: '/restaurant/menu', title: 'Thực đơn Nhà hàng' },
  { icon: 'Grid', link: '/restaurant/tables', title: 'Sơ đồ Bàn ăn' },
  { icon: 'Bed', link: '/hotel/rooms', title: 'Danh sách Phòng' },
  { icon: 'Layout', link: '/hotel/grid', title: 'Sơ đồ Phòng' },
];

const revenueData = {
  restaurant: 1823400,
  hotel: 1378200,
};

const statusStyles = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  INACTIVE: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const initialForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'Customer',
};

function QuickCard({ icon, link, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-950 px-4 py-4 text-left transition hover:border-gray-700 hover:bg-gray-800"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-800 text-gray-100">
        <span className="text-xs font-semibold uppercase">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">Chuyển tới</p>
        <p className="truncate text-sm font-semibold text-gray-100">{title}</p>
      </div>
    </button>
  );
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalRevenue = revenueData.restaurant + revenueData.hotel;
  const restaurantShare = totalRevenue ? Math.round((revenueData.restaurant / totalRevenue) * 100) : 0;
  const hotelShare = totalRevenue ? 100 - restaurantShare : 0;

  const filteredUsers = useMemo(() => {
    if (filterRole === 'All') return users;
    return users.filter((item) => item.role === filterRole);
  }, [users, filterRole]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error(error);
      showToast('Không thể tải danh sách người dùng.');
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createUser(form);
      setCreateModalOpen(false);
      setForm(initialForm);
      showToast('Tạo tài khoản mới thành công.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Tạo tài khoản thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setSubmitting(true);
      const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateUserStatus(userId, { status: nextStatus });
      showToast(`Tài khoản đã được ${nextStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'}.`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast('Cập nhật trạng thái thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const openResetModal = (item) => {
    setSelectedUser(item);
    setNewPassword('');
    setResetModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedUser(item);
    setDeleteModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 6) {
      showToast('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    try {
      setSubmitting(true);
      await resetUserPasswordApi(selectedUser.id, newPassword.trim());
      setResetModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
      showToast('Đổi mật khẩu thành công.');
    } catch (error) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setSubmitting(true);
      await deleteUserApi(selectedUser.id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      showToast('Đã xóa tài khoản thành công.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Xóa tài khoản thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const showManagementActions = (role) => ['RestaurantStaff', 'HotelStaff', 'RestaurantManager', 'HotelManager'].includes(role);

  return (
    <div className="flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto bg-gray-900 text-white p-6 space-y-6">
      <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-gray-400">SuperAdmin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-100">Xin chào, {user?.name || 'SuperAdmin'}</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-400">Tổng quan hệ thống nhà hàng và khách sạn, quản lý người dùng và truy cập nhanh các phân hệ chính.</p>
      </section>

      <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Bảng điều khiển nhanh</h2>
            <p className="mt-1 text-sm text-gray-400">4 lối tắt chính của SuperAdmin.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <QuickCard
              key={action.link}
              icon={action.icon}
              link={action.link}
              title={action.title}
              onClick={() => navigate(action.link)}
            />
          ))}
        </div>
      </section>

      <section className="grid w-full grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 w-full min-w-0 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-4 md:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-400">Doanh thu tổng hợp</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
              </h2>
            </div>
            <div className="shrink-0 rounded-full border border-gray-700/50 bg-gray-900 px-3 py-1 text-xs text-gray-300">Cập nhật tháng này</div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900 p-3.5 md:p-4">
              <p className="text-xs text-gray-400">Nhà hàng</p>
              <p className="mt-2 text-xl font-bold text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.restaurant)}</p>
              <p className="mt-1 text-xs text-gray-400">Món ăn + Phí dịch vụ</p>
            </div>
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900 p-3.5 md:p-4">
              <p className="text-xs text-gray-400">Khách sạn</p>
              <p className="mt-2 text-xl font-bold text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.hotel)}</p>
              <p className="mt-1 text-xs text-gray-400">Tiền phòng + Dịch vụ</p>
            </div>
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900 p-3.5 md:p-4">
              <p className="text-xs text-gray-400">TỔNG HỢP</p>
              <p className="mt-2 text-xl font-bold text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</p>
              <p className="mt-1 text-xs text-gray-400">Tổng doanh thu hệ thống</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">Tỷ trọng doanh thu</p>
              <p className="text-sm font-semibold text-gray-100">Nhà hàng {restaurantShare}% - Khách sạn {hotelShare}%</p>
            </div>
            <div className="space-y-3">
              <div className="h-4 overflow-hidden rounded-full bg-gray-800">
                <div className="h-4 rounded-full bg-emerald-500" style={{ width: `${restaurantShare}%` }} />
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-gray-800">
                <div className="h-4 rounded-full bg-indigo-500" style={{ width: `${hotelShare}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 w-full min-w-0 overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/60 p-4 md:p-5 shadow-xl">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-100">Thông tin người dùng</h2>
            <div className="mt-4 space-y-2 text-xs md:text-sm text-gray-300">
              <p className="min-w-0"><span className="font-semibold text-gray-100">Tên:</span> <span className="break-words">{user?.name}</span></p>
              <p className="min-w-0"><span className="font-semibold text-gray-100">Username:</span> <span className="break-words">{user?.username || '—'}</span></p>
              <p className="min-w-0"><span className="font-semibold text-gray-100">Email:</span> <span className="truncate break-all">{user?.email}</span></p>
              <p className="min-w-0"><span className="font-semibold text-gray-100">Role:</span> <span className="break-words">{user?.role}</span></p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 w-full min-w-0 rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-100">Quản lý & Cấp phát tài khoản</h2>
                <p className="mt-1 text-sm text-gray-400">Xem, lọc và thay đổi trạng thái người dùng.</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                Cấp tài khoản mới
              </button>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {ROLE_FILTERS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFilterRole(role)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${filterRole === role ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="w-full overflow-x-auto rounded-3xl border border-gray-800">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[14%]" />
                  <col className="w-[20%]" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead className="bg-gray-900">
                  <tr>
                    <th className="whitespace-nowrap min-w-[150px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Họ tên</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Username</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Role</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Trạng thái</th>
                    <th className="min-w-[220px] whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-950">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-gray-400">Đang tải dữ liệu người dùng...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-400">Không có người dùng phù hợp.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="whitespace-nowrap min-w-[150px] px-4 py-4 text-sm text-gray-100">{item.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">{item.username || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">{item.email}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">{item.role}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || 'border-gray-700 bg-gray-800 text-gray-300'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="min-w-[220px] px-4 py-3 text-center align-middle">
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(item.id, item.status)}
                              disabled={submitting}
                              className="px-3 py-1 text-xs rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {item.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                            </button>

                            {showManagementActions(item.role) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openResetModal(item)}
                                  disabled={submitting}
                                  className="px-3 py-1 text-xs rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Đổi MK
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(item)}
                                  disabled={submitting}
                                  className="px-3 py-1 text-xs rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </section>

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">Cấp tài khoản mới</h3>
                <p className="mt-1 text-sm text-gray-400">Điền thông tin tài khoản để tạo mới.</p>
              </div>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-sm text-gray-400 transition hover:text-gray-100">Đóng</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-gray-300">
                Họ tên
                <input name="name" value={form.name} onChange={handleInput} className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500" required />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                Username
                <input name="username" value={form.username} onChange={handleInput} className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500" required />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                Email
                <input name="email" type="email" value={form.email} onChange={handleInput} className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500" required />
              </label>
              <label className="space-y-2 text-sm text-gray-300">
                Mật khẩu ban đầu
                <input name="password" type="password" value={form.password} onChange={handleInput} className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500" required />
              </label>
              <label className="space-y-2 text-sm text-gray-300 sm:col-span-2">
                Chọn Role
                <select name="role" value={form.role} onChange={handleInput} className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500" required>
                  <option value="Customer">Customer</option>
                  <option value="RestaurantStaff">RestaurantStaff</option>
                  <option value="RestaurantManager">RestaurantManager</option>
                  <option value="HotelStaff">HotelStaff</option>
                  <option value="HotelManager">HotelManager</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="rounded-full border border-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-900">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-100">Đổi mật khẩu</h3>
                <p className="mt-1 text-sm text-gray-400">Tài khoản: {selectedUser.name} ({selectedUser.username || selectedUser.email})</p>
              </div>
              <button type="button" onClick={() => setResetModalOpen(false)} className="text-sm text-gray-400 transition hover:text-gray-100">Đóng</button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <label className="space-y-2 text-sm text-gray-300">
                Mật khẩu mới
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-emerald-500"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setResetModalOpen(false)} className="rounded-full border border-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-900">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-100">Xác nhận xóa tài khoản</h3>
              <p className="mt-2 text-sm text-gray-400">
                Bạn đang chuẩn bị xóa tài khoản <span className="font-semibold text-gray-100">{selectedUser.name}</span>. Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="rounded-full border border-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-900">
                Hủy
              </button>
              <button type="button" onClick={handleDeleteUser} disabled={submitting || selectedUser.role === 'SuperAdmin'} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-900 shadow-xl">{toast}</div>}
    </div>
  );
}