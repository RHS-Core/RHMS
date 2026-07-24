import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { loginUser } from '../../services/authService.js';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await loginUser({
        identifier: form.identifier.trim(),
        password: form.password,
      });

      const token = response?.data?.data?.token || response?.data?.token || response?.data?.accessToken;
      const userData = response?.data?.data?.user || response?.data?.user || null;

      if (!token || !userData) {
        throw new Error('Thông tin đăng nhập không hợp lệ.');
      }

      await login(token, userData);

      const role = userData.role;
      if (role === 'Customer') {
        navigate('/portal');
      } else if (role === 'RestaurantStaff' || role === 'RestaurantManager') {
        navigate('/restaurant/dashboard');
      } else if (role === 'HotelStaff' || role === 'HotelManager') {
        navigate('/hotel/dashboard');
      } else if (role === 'SuperAdmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/portal');
      }
    } catch (err) {
      const message = err?.response?.status === 401
        ? 'Tên đăng nhập hoặc mật khẩu không đúng.'
        : err?.message || 'Đăng nhập thất bại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold text-slate-800">Đăng nhập RHMS</h2>
        <p className="mb-6 text-sm text-slate-500">Đăng nhập để tiếp tục vào hệ thống.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="identifier" value={form.identifier} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Email hoặc username" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Mật khẩu" required />

          {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-blue-600">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
