import Header from '../components/common/Header.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="pb-8">{children}</main>
    </div>
  );
}
