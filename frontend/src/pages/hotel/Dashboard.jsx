import React from 'react';

function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow">
                <h2 className="text-2xl font-semibold">Dịch vụ Khách sạn</h2>
                <p className="mt-2 text-sm text-slate-500">Tổng quan dịch vụ, điều phối phòng và đặt phòng.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 p-4">Phòng trống</div>
                    <div className="rounded-2xl border border-slate-200 p-4">Đặt phòng</div>
                    <div className="rounded-2xl border border-slate-200 p-4">Dịch vụ phòng</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;