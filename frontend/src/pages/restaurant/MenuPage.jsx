import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { createFood, getFoods } from '../../services/foodService.js';

const categories = ['All', 'Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];
const categoryMap = {
  All: 'All',
  'Khai vị': 'Appetizer',
  'Món chính': 'MainCourse',
  'Tráng miệng': 'Dessert',
  'Đồ uống': 'Drink',
};

export default function MenuPage() {
  const { user } = useAuthContext();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Appetizer', price: '', imageUrl: '', description: '' });
  const [toast, setToast] = useState('');

  const navigate = useNavigate();
  const canManage = ['RestaurantManager', 'SuperAdmin'].includes(user?.role);

  const addToCart = (food) => {
    const existingCart = JSON.parse(localStorage.getItem('restaurantCart') || '[]');
    const nextCart = [...existingCart];
    const existingItem = nextCart.find((item) => item.foodId === food.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      nextCart.push({ foodId: food.id, name: food.name, price: Number(food.price || 0), qty: 1 });
    }

    localStorage.setItem('restaurantCart', JSON.stringify(nextCart));
    navigate('/restaurant/orders');
  };

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getFoods();
      const payload = response?.data?.data;
      setFoods(payload?.items ?? payload ?? response?.data ?? []);
    } catch (error) {
      setToast('Không thể tải thực đơn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    const term = search.toLowerCase();
    return [...foods]
      .filter((item) => {
        const matchCategory = activeCategory === 'All' || item.category === categoryMap[activeCategory];
        const matchSearch = !term || item.name?.toLowerCase().includes(term);
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchCategory && matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
  }, [foods, activeCategory, search, sortOrder, statusFilter]);

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      await createFood({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        description: form.description,
      });
      setToast('Thêm món mới thành công!');
      setShowModal(false);
      setForm({ name: '', category: 'Appetizer', price: '', imageUrl: '', description: '' });
      loadFoods();
    } catch (error) {
      setToast('Thêm món thất bại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Quản lý Thực đơn</h2>
            <p className="text-sm text-slate-500">Tìm món, sắp xếp và quản lý menu nhà hàng.</p>
          </div>
          {canManage && (
            <button onClick={() => setShowModal(true)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white">+ Thêm món mới</button>
          )}
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm món ăn..." className="w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-sm" />
          <div className="flex gap-2">
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              <option value="All">Tất cả trạng thái</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`rounded-full px-4 py-2 text-sm ${activeCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">Đang tải thực đơn...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFoods.map((food) => (
              <div key={food.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="mb-3 h-32 rounded-lg bg-slate-100" />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{food.name}</h3>
                    <p className="text-sm text-slate-500">{food.description || 'Món ăn đặc biệt'}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${food.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{food.status || 'AVAILABLE'}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-700">{Number(food.price || 0).toLocaleString('vi-VN')}₫</span>
                  {user?.role === 'Customer' ? (
                    <button onClick={() => addToCart(food)} className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white">Đặt món</button>
                  ) : (
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-slate-200 px-3 py-2 text-sm">Sửa</button>
                      <button className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white">Xóa</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">Thêm món mới</h3>
            <form onSubmit={handleCreateFood} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên món" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="Appetizer">Khai vị</option>
                <option value="MainCourse">Món chính</option>
                <option value="Dessert">Tráng miệng</option>
                <option value="Drink">Đồ uống</option>
              </select>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Giá" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Link ảnh" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg bg-slate-200 px-4 py-2">Hủy</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Lưu món</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">{toast}</div>}
    </div>
  );
}
