import { useState } from 'react';
import { changeMyPasswordApi } from '../../services/userService.js';

export default function CustomerProfilePage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      showToast('Mật khẩu mới không khớp.');
      return;
    }

    try {
      setLoading(true);
      await changeMyPasswordApi(form.oldPassword, form.newPassword);
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Đổi mật khẩu cá nhân thành công.');
    } catch (error) {
      showToast(error?.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-900">Đổi mật khẩu cá nhân</h2>
        <p className="mt-2 text-sm text-slate-500">Cập nhật mật khẩu an toàn cho tài khoản của bạn.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            placeholder="Mật khẩu hiện tại"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            placeholder="Mật khẩu mới"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <button type="submit" disabled={loading} className="rounded-full bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </button>
        </form>

        {toast && <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white">{toast}</div>}
      </div>
    </div>
  );
}