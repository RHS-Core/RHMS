import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { createFood, getFoods, deleteFood, updateFood } from '../../services/foodService.js';

const categories = ['All', 'Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];
const categoryMap = {
  All: 'All',
  'Khai vị': 'Appetizer',
  'Món chính': 'MainCourse',
  'Tráng miệng': 'Dessert',
  'Đồ uống': 'Drink',
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image';

// Dữ liệu món ăn mặc định khi database rỗng
const defaultFoods = [
  {
    id: 1,
    name: "Bò Bit-tết Sốt Vang Đỏ",
    category: "MainCourse",
    price: 350000,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80",
    description: "Thịt bò thăn nhập khẩu áp chảo kèm sốt vang đỏ Pháp đậm đà."
  },
  {
    id: 2,
    name: "Súp Hải Sản Bào Ngư",
    category: "Appetizer",
    price: 180000,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80",
    description: "Súp thanh ngọt từ hải sản tươi sống và bào ngư thượng hạng."
  },
  {
    id: 3,
    name: "Cá Hồi Nướng Sốt Bơ Chanh",
    category: "MainCourse",
    price: 290000,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80",
    description: "Cá hồi Nauy áp chảo xém cạnh, sốt bơ chanh thơm béo."
  },
  {
    id: 4,
    name: "Bánh Tiramisu Ý",
    category: "Dessert",
    price: 85000,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80",
    description: "Bánh Tiramisu truyền thống mềm mịn, đắng nhẹ vị cà phê."
  },
  {
    id: 5,
    name: "Cocktail Mojito Bạc Hà",
    category: "Drink",
    price: 65000,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
    description: "Thức uống giải nhiệt mát lạnh kết hợp chanh tươi và bạc hà."
  }
];

// Dữ liệu hình ảnh không gian phòng ăn / nhà hàng
const diningRooms = [
  {
    id: 1,
    title: "Phòng Ăn VIP - Sức chứa 12 khách",
    type: "Phòng VIP",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    description: "Không gian riêng tư, ấm cúng thích hợp cho tiệc gia đình và gặp gỡ đối tác."
  },
  {
    id: 2,
    title: "Sảnh Chính Sang Trọng",
    type: "Sảnh Chung",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
    description: "Thiết kế hiện đại với ánh đèn ấm áp, tầm nhìn thoáng đãng."
  },
  {
    id: 3,
    title: "Khu Vực Bàn Sân Thượng (Rooftop)",
    type: "Ngoài Trời",
    imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
    description: "Thưởng thức ẩm thực dưới ánh sao với không gian thoáng mát."
  }
];

export default function MenuPage() {
  const { user } = useAuthContext();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Appetizer', price: '', imageUrl: '', description: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();
  const canManage = ['RestaurantManager', 'SuperAdmin'].includes(user?.role);
  const isCustomer = user?.role === 'Customer';

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
    setToast('✓ Thêm vào đơn hàng thành công!');
    setTimeout(() => setToast(''), 2000);
  };

  const createOrder = (food) => {
    const cartItem = { foodId: food.id, name: food.name, price: Number(food.price || 0), qty: 1 };
    localStorage.setItem('restaurantCart', JSON.stringify([cartItem]));
    navigate('/restaurant/orders');
  };

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getFoods();
      const payload = response?.data?.data;
      const apiData = payload?.items ?? payload ?? response?.data ?? [];

      // Nếu có món từ Backend thì dùng, nếu rỗng thì lấy món mẫu chế sẵn
      if (Array.isArray(apiData) && apiData.length > 0) {
        setFoods(apiData);
      } else {
        setFoods(defaultFoods);
      }
    } catch (error) {
      setFoods(defaultFoods);
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setForm({ ...form, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (value) => {
    setForm({ ...form, imageUrl: value });
    setImagePreview(value || DEFAULT_IMAGE);
  };

  const openModal = (food = null) => {
    if (food) {
      setEditingId(food.id);
      setForm({ name: food.name, category: food.category, price: food.price, imageUrl: food.imageUrl || '', description: food.description || '' });
      setImagePreview(food.imageUrl || DEFAULT_IMAGE);
    } else {
      setEditingId(null);
      setForm({ name: '', category: 'Appetizer', price: '', imageUrl: '', description: '' });
      setImagePreview(DEFAULT_IMAGE);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setToast('Vui lòng nhập tên và giá tiền.');
      return;
    }

    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        description: form.description,
      };

      if (editingId) {
        await updateFood(editingId, payload);
        setToast('Cập nhật món ăn thành công!');
      } else {
        await createFood(payload);
        setToast('Thêm món mới thành công!');
      }

      setShowModal(false);
      setForm({ name: '', category: 'Appetizer', price: '', imageUrl: '', description: '' });
      setImagePreview('');
      loadFoods();
    } catch (error) {
      setToast(editingId ? 'Cập nhật thất bại.' : 'Thêm món thất bại.');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa món ăn này?')) return;
    try {
      await deleteFood(id);
      setToast('Xóa món ăn thành công!');
      loadFoods();
    } catch (error) {
      setToast('Xóa thất bại.');
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
            <button onClick={() => openModal()} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              + Thêm món mới
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm món ăn..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 md:max-w-sm"
          />
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
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            <p className="mt-2">Đang tải thực đơn...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFoods.map((food) => (
              <div key={food.id} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:shadow-lg">
                <div className="h-44 bg-slate-100">
                  <img
                    src={food.imageUrl || DEFAULT_IMAGE}
                    alt={food.name}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-800">{food.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{food.description || 'Món ăn đặc biệt'}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        food.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {food.status || 'AVAILABLE'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-700">
                      {Number(food.price || 0).toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  {/* Nút thao tác theo role */}
                  <div className="mt-4 flex gap-2">
                    {isCustomer ? (
                      <>
                        <button
                          onClick={() => addToCart(food)}
                          className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                        >
                          Thêm vào đơn
                        </button>
                        <button
                          onClick={() => createOrder(food)}
                          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Đặt ngay
                        </button>
                      </>
                    ) : user?.role === 'RestaurantStaff' ? (
                      <button
                        onClick={() => createOrder(food)}
                        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Tạo đơn tại bàn
                      </button>
                    ) : canManage ? (
                      <>
                        <button
                          onClick={() => openModal(food)}
                          className="flex-1 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-300"
                        >
                          ✎ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                        >
                          ✕ Xóa
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Khung hiển thị Không gian & Phòng ăn */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Không Gian & Phòng Ăn</h3>
            <p className="text-sm text-slate-500">Khám phá các phòng ăn và sảnh tiệc sang trọng tại nhà hàng.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diningRooms.map((room) => (
              <div 
                key={room.id} 
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={room.imageUrl}
                    alt={room.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {room.type}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600">
                    {room.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {room.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal thêm/sửa món */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">{editingId ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}</h3>
            <form onSubmit={handleSaveFood} className="space-y-3">
              {imagePreview && (
                <div className="flex justify-center">
                  <img src={imagePreview} alt="Preview" className="h-40 w-40 rounded-lg object-cover" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Upload ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tên món"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="Appetizer">Khai vị</option>
                <option value="MainCourse">Món chính</option>
                <option value="Dessert">Tráng miệng</option>
                <option value="Drink">Đồ uống</option>
              </select>
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Giá"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows="3"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  {editingId ? 'Cập nhật' : 'Lưu'} món
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">
          {toast}
        </div>
      )}
    </div>
  );
}