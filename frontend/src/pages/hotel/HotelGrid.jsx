import React from 'react';

const rooms = [
  { id: 1, name: 'Phòng 101', type: 'Standard', status: 'Trống', price: 500000 },
  { id: 2, name: 'Phòng 102', type: 'Standard', status: 'Đã đặt', price: 600000 },
  { id: 3, name: 'Phòng 201', type: 'VIP', status: 'Trống', price: 1200000 },
  { id: 4, name: 'Phòng 202', type: 'VIP', status: 'Đang sử dụng', price: 1500000 },
];

export default function HotelGrid() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Sơ đồ Phòng Khách sạn</h2>
          <p className="text-sm text-slate-500">Tổng quan trạng thái phòng theo lưới.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" />
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-sm text-slate-500">{room.type}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1">{room.status}</span>
                <span className="font-semibold text-blue-700">{Number(room.price).toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}