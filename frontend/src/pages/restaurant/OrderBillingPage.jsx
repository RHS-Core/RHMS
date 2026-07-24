import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { createOrder } from '../../services/orderService.js';
import { getFoods } from '../../services/foodService.js';
import { getTables } from '../../services/tableService.js';

const STORAGE_KEY = 'restaurantCart';

export default function OrderBillingPage() {
  const { user } = useAuthContext();
  const [foods, setFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [items, setItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const saveCart = (nextItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [foodsResponse, tablesResponse] = await Promise.all([getFoods(), getTables()]);
        const foodsPayload = foodsResponse?.data?.data;
        const tablePayload = tablesResponse?.data?.data;
        setFoods(foodsPayload?.items ?? foodsPayload ?? foodsResponse?.data ?? []);
        const tableList = tablePayload?.items ?? tablePayload ?? tablesResponse?.data ?? [];
        setTables(tableList);
        const storedCart = loadCart();
        setItems(storedCart);
        setSelectedTable(tableList[0]?.id ?? null);
      } catch (error) {
        setToast('Không thể tải dữ liệu gọi món.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addItem = (food) => {
    setItems((prev) => {
      const nextItems = [...prev];
      const existing = nextItems.find((item) => item.foodId === food.id);
      if (existing) {
        existing.qty += 1;
      } else {
        nextItems.push({ foodId: food.id, name: food.name, price: Number(food.price || 0), qty: 1 });
      }
      saveCart(nextItems);
      return nextItems;
    });
  };

  const updateQty = (foodId, delta) => {
    setItems((prev) => {
      const nextItems = prev
        .map((item) => (item.foodId === foodId ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0);
      saveCart(nextItems);
      return nextItems;
    });
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.qty, 0);
    const vat = subtotal * 0.08;
    const serviceFee = subtotal * 0.05;
    const discount = subtotal > 200000 ? 30000 : 0;
    const total = subtotal + vat + serviceFee - discount;
    return { subtotal, vat, serviceFee, discount, total };
  }, [items]);

  const buildPayload = () => ({
    tableId: Number(selectedTable),
    items: items.map((item) => ({ foodId: item.foodId, quantity: item.qty })),
  });

  const clearCart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  const sendOrder = async () => {
    if (!items.length) {
      setToast('Vui lòng chọn ít nhất một món.');
      return;
    }

    try {
      await createOrder({ ...buildPayload(), status: 'PENDING' });
      setToast('Đơn hàng đã gửi xuống bếp.');
      clearCart();
    } catch (error) {
      setToast('Không thể gửi đơn hàng.');
    }
  };

  const checkout = async () => {
    if (!items.length) {
      setToast('Vui lòng chọn ít nhất một món.');
      return;
    }

    try {
      await createOrder({ ...buildPayload(), status: 'COMPLETED', paymentStatus: 'PAID' });
      setShowInvoice(true);
      setToast('Thanh toán thành công.');
      clearCart();
    } catch (error) {
      setToast('Thanh toán thất bại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Gọi món & Lập hóa đơn</h2>
            <p className="text-sm text-slate-500">Tạo đơn và thanh toán nhanh cho bàn khách.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Chọn bàn</label>
              <select value={selectedTable ?? ''} onChange={(e) => setSelectedTable(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <option key={table.id} value={table.id}>Bàn {table.number} - {table.capacity} khách</option>
                  ))
                ) : (
                  <option value="">Không có bàn</option>
                )}
              </select>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-500">Đang tải menu...</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {foods.map((food) => (
                  <button key={food.id} onClick={() => addItem(food)} className="rounded-xl border border-slate-200 p-4 text-left shadow-sm">
                    <h3 className="font-semibold">{food.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{food.description || 'Món ăn đặc biệt'}</p>
                    <p className="mt-2 font-semibold text-blue-700">{Number(food.price || 0).toLocaleString('vi-VN')}₫</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-semibold">Đơn tạm tính</h3>
            {items.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Chưa có món nào.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.foodId} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">{Number(item.price || 0).toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.foodId, -1)} className="h-8 w-8 rounded-full bg-slate-200">−</button>
                      <span className="min-w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.foodId, 1)} className="h-8 w-8 rounded-full bg-slate-200">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>Tạm tính</span><span>{totals.subtotal.toLocaleString('vi-VN')}₫</span></div>
              <div className="flex justify-between"><span>VAT (8%)</span><span>{totals.vat.toLocaleString('vi-VN')}₫</span></div>
              <div className="flex justify-between"><span>Phí dịch vụ (5%)</span><span>{totals.serviceFee.toLocaleString('vi-VN')}₫</span></div>
              <div className="flex justify-between"><span>Khuyến mãi</span><span>-{totals.discount.toLocaleString('vi-VN')}₫</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold"><span>Tổng cộng</span><span>{totals.total.toLocaleString('vi-VN')}₫</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button onClick={sendOrder} className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white">Gửi đơn xuống bếp</button>
              <button onClick={checkout} className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white">Thanh toán & In hóa đơn</button>
            </div>
          </div>
        </div>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">Xem trước hóa đơn</h3>
            <div className="rounded-xl border p-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">RHMS Restaurant</p>
                  <p className="text-slate-500">Hóa đơn bán hàng</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{tables.find((table) => table.id === Number(selectedTable))?.number ?? selectedTable}</p>
                  <p className="text-slate-500">{new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div key={item.foodId} className="flex justify-between">
                    <span>{item.name} x{item.qty}</span>
                    <span>{(Number(item.price || 0) * item.qty).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-2 text-sm">
                <div className="flex justify-between"><span>Tổng</span><span>{totals.subtotal.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between"><span>VAT</span><span>{totals.vat.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between"><span>Phí dịch vụ</span><span>{totals.serviceFee.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between font-semibold"><span>Thanh toán</span><span>{totals.total.toLocaleString('vi-VN')}₫</span></div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowInvoice(false)} className="rounded-lg bg-slate-200 px-4 py-2">Đóng</button>
              <button onClick={() => window.print()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">In hóa đơn</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white">{toast}</div>}
    </div>
  );
}
