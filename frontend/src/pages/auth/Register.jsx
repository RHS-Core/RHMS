import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { registerUser } from '../../services/authService.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        throw new Error('Email không đúng định dạng.');
      }

      if (form.password.length < 8) {
        throw new Error('Mật khẩu phải có ít nhất 8 ký tự.');
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp.');
      }

      setLoading(true);
      await registerUser({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'Customer',
      });

      setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      const message = err?.response?.status === 409
        ? 'Tên đăng nhập hoặc email đã tồn tại.'
        : err?.message || 'Đăng ký thất bại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold text-slate-800">Tạo tài khoản RHMS</h2>
        <p className="mb-6 text-sm text-slate-500">Đăng ký để sử dụng hệ thống Nhà hàng & Khách sạn.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Họ tên" required />
          <input name="username" value={form.username} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Username" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Mật khẩu" required />
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Xác nhận mật khẩu" required />

          {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-md bg-green-50 p-2 text-sm text-green-600">{success}</div>}

          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-blue-600">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
