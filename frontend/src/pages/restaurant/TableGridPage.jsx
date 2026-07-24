import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getTables, reserveTable, updateTableStatus } from '../../services/tableService.js';

const statusStyles = {
  AVAILABLE: 'bg-emerald-500 text-white',
  RESERVED: 'bg-amber-500 text-white',
  OCCUPIED: 'bg-rose-500 text-white',
  CLEANING: 'bg-slate-400 text-white',
};

const statusOptions = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];

export default function TableGridPage() {
  const { user } = useAuthContext();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusChoice, setStatusChoice] = useState('AVAILABLE');
  const [toast, setToast] = useState('');

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await getTables();
      const payload = response?.data?.data;
      setTables(payload?.items ?? payload ?? response?.data ?? []);
    } catch (error) {
      setToast('Không thể tải danh sách bàn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const openTableModal = (table) => {
    setSelectedTable(table);
    setStatusChoice(table.status || 'AVAILABLE');
    setShowModal(true);
  };

  const handleReserve = async () => {
    try {
      await reserveTable(selectedTable.id);
      setToast('Đã đặt bàn thành công.');
      setShowModal(false);
      loadTables();
    } catch (error) {
      setToast('Đặt bàn thất bại.');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateTableStatus(selectedTable.id, { status: statusChoice });
      setToast('Cập nhật trạng thái bàn thành công.');
      setShowModal(false);
      loadTables();
    } catch (error) {
      setToast('Cập nhật trạng thái thất bại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Sơ đồ Bàn ăn</h2>
            <p className="text-sm text-slate-500">Theo dõi trạng thái bàn theo thời gian thực.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">Đang tải sơ đồ bàn...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <button key={table.id} onClick={() => openTableModal(table)} className={`rounded-2xl border p-4 text-left shadow-sm ${statusStyles[table.status] || 'bg-slate-100 text-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Bàn {table.number}</h3>
                  <span className="text-sm">{table.capacity} người</span>
                </div>
                <p className="mt-2 text-sm opacity-90">{table.status}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-xl font-semibold">Bàn {selectedTable.number}</h3>
            <p className="mb-4 text-sm text-slate-500">Sức chứa: {selectedTable.capacity} người • Trạng thái: {selectedTable.status}</p>

            {user?.role === 'Customer' ? (
              <div className="space-y-3">
                <input type="date" className="w-full rounded-lg border px-3 py-2" />
                <input type="time" className="w-full rounded-lg border px-3 py-2" />
                <input type="number" min="1" className="w-full rounded-lg border px-3 py-2" placeholder="Số lượng khách" />
                <button onClick={handleReserve} className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white">Đặt bàn</button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => window.location.href = '/restaurant/orders'} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">Chuyển tới Gọi món</button>
                <div>
                  <label className="mb-2 block text-sm font-medium">Cập nhật trạng thái</label>
                  <select value={statusChoice} onChange={(e) => setStatusChoice(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button onClick={handleStatusUpdate} className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-2 text-white">Lưu trạng thái</button>
                </div>
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2">Đóng</button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">{toast}</div>}
    </div>
  );
}
