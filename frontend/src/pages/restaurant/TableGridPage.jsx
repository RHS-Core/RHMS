import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getTables, reserveTable, updateTableStatus } from '../../services/tableService.js';

const TABLE_STATUS_OPTIONS = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];
const ROOM_STATUS_OPTIONS = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];
const ROOM_PLACEHOLDER = 'https://via.placeholder.com/960x540?text=VIP+Room';

const STATUS_LABELS = {
  AVAILABLE: 'Trống',
  RESERVED: 'Đã đặt',
  OCCUPIED: 'Có khách',
  CLEANING: 'Đang dọn',
};

const STATUS_CLASSES = {
  AVAILABLE: 'bg-emerald-500 text-white',
  RESERVED: 'bg-amber-500 text-white',
  OCCUPIED: 'bg-rose-500 text-white',
  CLEANING: 'bg-slate-400 text-white',
};

const DEFAULT_TABLES = Array.from({ length: 15 }, (_, index) => {
  const sequence = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];
  return {
    id: index + 1,
    number: index + 1,
    capacity: [2, 4, 6, 8][index % 4],
    status: sequence[index % sequence.length],
  };
});

const DEFAULT_VIP_ROOMS = [
  {
    id: 101,
    name: 'Phòng VIP 1 - Hoàng Gia',
    capacity: 6,
    serviceFee: 150000,
    status: 'AVAILABLE',
    imageUrl: ROOM_PLACEHOLDER,
    amenities: ['Karaoke', 'Điều hòa 2 chiều', 'View sân vườn'],
    notes: 'Không gian riêng tư, phù hợp gia đình nhỏ và tiếp khách thân mật.',
  },
  {
    id: 102,
    name: 'Phòng VIP 2 - Sapphire',
    capacity: 8,
    serviceFee: 200000,
    status: 'RESERVED',
    imageUrl: ROOM_PLACEHOLDER,
    amenities: ['Karaoke', 'Sound System', 'Mini bar'],
    notes: 'Trang bị âm thanh cao cấp, phục vụ tiệc sinh nhật và liên hoan.',
  },
  {
    id: 103,
    name: 'Phòng VIP 3 - Ngọc Trai',
    capacity: 4,
    serviceFee: 120000,
    status: 'AVAILABLE',
    imageUrl: ROOM_PLACEHOLDER,
    amenities: ['Điều hòa', 'View biển', 'Phục vụ riêng'],
    notes: 'Không gian nhỏ gọn, thích hợp couple hoặc bữa tối riêng tư.',
  },
  {
    id: 104,
    name: 'Phòng VIP 4 - Vàng Kim',
    capacity: 10,
    serviceFee: 250000,
    status: 'OCCUPIED',
    imageUrl: ROOM_PLACEHOLDER,
    amenities: ['Karaoke', 'Chef riêng', 'Private Service'],
    notes: 'Phòng cao cấp nhất với dịch vụ phục vụ riêng trọn gói.',
  },
  {
    id: 105,
    name: 'Phòng VIP 5 - Bạch Kim',
    capacity: 5,
    serviceFee: 180000,
    status: 'CLEANING',
    imageUrl: ROOM_PLACEHOLDER,
    amenities: ['Điều hòa', 'View sân vườn', 'Phục vụ riêng'],
    notes: 'Phòng đang được vệ sinh, sẵn sàng cho lượt khách tiếp theo.',
  },
];

const normalizeStatus = (status) => {
  const value = String(status || '').toUpperCase();
  if (value.includes('RESERV') || value.includes('ĐÃ ĐẶT')) return 'RESERVED';
  if (value.includes('OCCUP') || value.includes('CÓ KHÁCH') || value.includes('ĐANG SỬ DỤNG')) return 'OCCUPIED';
  if (value.includes('CLEAN') || value.includes('DỌN')) return 'CLEANING';
  return 'AVAILABLE';
};

const normalizeTables = (items) => {
  const mapped = Array.isArray(items)
    ? items.map((item, index) => ({
        id: item.id ?? index + 1,
        number: item.number ?? item.tableNumber ?? index + 1,
        capacity: Number(item.capacity ?? 4),
        status: normalizeStatus(item.status),
      }))
    : [];

  const existingNumbers = new Set(mapped.map((item) => Number(item.number)));
  const missing = DEFAULT_TABLES.filter((item) => !existingNumbers.has(Number(item.number)));
  return [...mapped, ...missing].slice(0, 15);
};

const getStatusStyle = (status) => STATUS_CLASSES[normalizeStatus(status)] || 'bg-slate-100 text-slate-700';

export default function TableGridPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [tables, setTables] = useState(DEFAULT_TABLES);
  const [vipRooms, setVipRooms] = useState(DEFAULT_VIP_ROOMS);
  const [activeTab, setActiveTab] = useState('tables');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('table');
  const [showModal, setShowModal] = useState(false);
  const [showVipEditor, setShowVipEditor] = useState(false);
  const [statusChoice, setStatusChoice] = useState('AVAILABLE');
  const [toast, setToast] = useState('');
  const [reserveForm, setReserveForm] = useState({ date: '', time: '', guests: '' });
  const [vipEditForm, setVipEditForm] = useState({ name: '', serviceFee: '', imageUrl: '', amenitiesText: '', notes: '' });

  const fetchTables = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await getTables();
      const payload = response?.data?.data;
      const tableItems = payload?.items ?? payload ?? response?.data ?? [];
      setTables(normalizeTables(tableItems));
    } catch (error) {
      setTables(DEFAULT_TABLES);
      if (!silent) setToast('Không thể tải danh sách bàn.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const intervalId = window.setInterval(() => {
      fetchTables(true);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  const openTableModal = (table) => {
    setModalType('table');
    setSelectedItem(table);
    setStatusChoice(normalizeStatus(table.status));
    setReserveForm({ date: '', time: '', guests: '' });
    setShowVipEditor(false);
    setShowModal(true);
  };

  const openVipModal = (room, editMode = false) => {
    setModalType('vip');
    setSelectedItem(room);
    setStatusChoice(normalizeStatus(room.status));
    setReserveForm({ date: '', time: '', guests: '' });
    setVipEditForm({
      name: room.name || '',
      serviceFee: room.serviceFee || '',
      imageUrl: room.imageUrl || ROOM_PLACEHOLDER,
      amenitiesText: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      notes: room.notes || '',
    });
    setShowVipEditor(editMode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setShowVipEditor(false);
  };

  const handleReserve = async () => {
    if (!reserveForm.date || !reserveForm.time || !reserveForm.guests) {
      setToast('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      await reserveTable(selectedItem.id);
      setToast(`Đã đặt ${modalType === 'vip' ? 'phòng' : 'bàn'} thành công.`);
      closeModal();
      fetchTables(true);
    } catch (error) {
      setToast('Đặt chỗ thất bại.');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateTableStatus(selectedItem.id, { status: statusChoice });
      setToast('Cập nhật trạng thái bàn thành công.');
      closeModal();
      fetchTables(true);
    } catch (error) {
      setToast('Cập nhật trạng thái thất bại.');
    }
  };

  const handleCheckIn = () => {
    navigate(`/restaurant/orders?tableId=${selectedItem.id}`);
    closeModal();
  };

  const handleVipImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setVipEditForm((current) => ({ ...current, imageUrl: String(reader.result || ROOM_PLACEHOLDER) }));
    };
    reader.readAsDataURL(file);
  };

  const handleVipSave = () => {
    if (!selectedItem) return;
    const amenities = vipEditForm.amenitiesText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    setVipRooms((current) =>
      current.map((room) =>
        room.id === selectedItem.id
          ? {
              ...room,
              name: vipEditForm.name,
              serviceFee: Number(vipEditForm.serviceFee || 0),
              imageUrl: vipEditForm.imageUrl || ROOM_PLACEHOLDER,
              amenities,
              notes: vipEditForm.notes,
            }
          : room
      )
    );
    setToast('Cập nhật phòng VIP thành công.');
    closeModal();
  };

  const renderTableCard = (table) => (
    <button
      key={table.id}
      onClick={() => openTableModal(table)}
      className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${getStatusStyle(table.status)}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bàn {table.number}</h3>
        <span className="text-sm opacity-90">{table.capacity} người</span>
      </div>
      <p className="mt-2 text-sm opacity-90">{STATUS_LABELS[normalizeStatus(table.status)] || table.status}</p>
    </button>
  );

  const renderVipCard = (room) => (
    <button
      key={room.id}
      onClick={() => openVipModal(room, false)}
      className={`overflow-hidden rounded-2xl border-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${getStatusStyle(room.status)}`}
    >
      <div className="h-44 w-full bg-slate-200">
        <img src={room.imageUrl || ROOM_PLACEHOLDER} alt={room.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="text-sm opacity-90">Sức chứa: {room.capacity} khách</p>
          </div>
          <span className="rounded-lg bg-white/20 px-2 py-1 text-sm font-semibold">
            {Number(room.serviceFee).toLocaleString('vi-VN')}₫/giờ
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {room.amenities.map((amenity) => (
            <span key={amenity} className="rounded-full bg-white/20 px-2 py-1 text-xs">
              {amenity}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm opacity-90">{room.notes}</p>
      </div>
    </button>
  );

  const isCustomer = user?.role === 'Customer';
  const isStaff = user?.role === 'RestaurantStaff';
  const isManager = ['RestaurantManager', 'SuperAdmin'].includes(user?.role);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Sơ đồ Bàn ăn & Phòng VIP</h2>
            <p className="text-sm text-slate-500">Theo dõi trạng thái bàn theo thời gian thực.</p>
          </div>
          <div className="text-sm text-slate-500">Tự động cập nhật mỗi 7 giây</div>
        </div>

        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'tables' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <i className="bi bi-grid-3x3 me-2"></i>
            15 Bàn Ăn
          </button>
          <button
            onClick={() => setActiveTab('vip')}
            className={`px-4 py-2 font-medium transition ${activeTab === 'vip' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <i className="bi bi-star me-2"></i>
            5 Phòng VIP
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            <p className="mt-2">Đang tải...</p>
          </div>
        ) : activeTab === 'tables' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tables.map(renderTableCard)}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{vipRooms.map(renderVipCard)}</div>
        )}
      </div>

      {showModal && selectedItem && modalType === 'table' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-xl font-semibold">Bàn {selectedItem.number}</h3>
            <p className="mb-4 text-sm text-slate-500">
              Sức chứa: {selectedItem.capacity} người • Trạng thái: {STATUS_LABELS[normalizeStatus(selectedItem.status)]}
            </p>

            {isCustomer ? (
              <div className="space-y-3">
                <input
                  type="date"
                  value={reserveForm.date}
                  onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  type="time"
                  value={reserveForm.time}
                  onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                  type="number"
                  min="1"
                  value={reserveForm.guests}
                  onChange={(e) => setReserveForm({ ...reserveForm, guests: e.target.value })}
                  placeholder="Số lượng khách"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <button onClick={handleReserve} className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                  Đặt bàn ngay
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {(isStaff || isManager) && (
                  <button onClick={handleCheckIn} className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Check-in & Gọi món
                  </button>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium">Cập nhật trạng thái</label>
                  <select value={statusChoice} onChange={(e) => setStatusChoice(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    {TABLE_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleStatusUpdate} className="mt-3 w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900">
                    Lưu trạng thái
                  </button>
                </div>
              </div>
            )}

            <button onClick={closeModal} className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 font-medium hover:bg-slate-200">
              Đóng
            </button>
          </div>
        </div>
      )}

      {showModal && selectedItem && modalType === 'vip' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            {!showVipEditor ? (
              <>
                <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="overflow-hidden rounded-2xl bg-slate-100">
                    <img src={selectedItem.imageUrl || ROOM_PLACEHOLDER} alt={selectedItem.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedItem.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">Sức chứa: {selectedItem.capacity} khách</p>
                    <p className="mt-3 text-lg font-semibold text-blue-700">{Number(selectedItem.serviceFee).toLocaleString('vi-VN')}₫/giờ</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedItem.amenities.map((amenity) => (
                        <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{selectedItem.notes}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {isCustomer && (
                    <div className="grid gap-3 md:grid-cols-3">
                      <input type="date" value={reserveForm.date} onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                      <input type="time" value={reserveForm.time} onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                      <input type="number" min="1" value={reserveForm.guests} onChange={(e) => setReserveForm({ ...reserveForm, guests: e.target.value })} placeholder="Số khách" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {isCustomer && (
                      <button onClick={handleReserve} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                        Đặt phòng ngay
                      </button>
                    )}
                    {isManager && (
                      <button onClick={() => setShowVipEditor(true)} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                        Chỉnh sửa phòng VIP
                      </button>
                    )}
                    <button onClick={closeModal} className="rounded-lg bg-slate-100 px-4 py-2 font-medium hover:bg-slate-200">
                      Đóng
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Chỉnh sửa Phòng VIP</h3>
                <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                  <div className="space-y-3">
                    <input value={vipEditForm.name} onChange={(e) => setVipEditForm({ ...vipEditForm, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Tên phòng" />
                    <input value={vipEditForm.serviceFee} onChange={(e) => setVipEditForm({ ...vipEditForm, serviceFee: e.target.value })} type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Phí dịch vụ / giờ" />
                    <input value={vipEditForm.imageUrl} onChange={(e) => setVipEditForm({ ...vipEditForm, imageUrl: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Image URL" />
                    <input type="file" accept="image/*" onChange={handleVipImageChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <textarea value={vipEditForm.amenitiesText} onChange={(e) => setVipEditForm({ ...vipEditForm, amenitiesText: e.target.value })} rows="3" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Tiện nghi, ngăn cách bằng dấu phẩy" />
                    <textarea value={vipEditForm.notes} onChange={(e) => setVipEditForm({ ...vipEditForm, notes: e.target.value })} rows="3" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Ghi chú mô tả" />
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img src={vipEditForm.imageUrl || ROOM_PLACEHOLDER} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleVipSave} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                    Lưu thay đổi
                  </button>
                  <button onClick={() => setShowVipEditor(false)} className="rounded-lg bg-slate-100 px-4 py-2 font-medium hover:bg-slate-200">
                    Quay lại
                  </button>
                  <button onClick={closeModal} className="rounded-lg bg-slate-200 px-4 py-2 font-medium hover:bg-slate-300">
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">{toast}</div>}
    </div>
  );
}
