import Header from '../components/common/Header.jsx';
import HotelSidebar from '../components/HotelSidebar.jsx';

export default function HotelLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="flex">
        <HotelSidebar />
        <main className="w-full pb-8">{children}</main>
      </div>
    </div>
  );
}