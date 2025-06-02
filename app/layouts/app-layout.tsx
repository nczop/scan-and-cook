import { Outlet } from 'react-router';
import BottomNav from '~/components/bottom-nav/bottom-nav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Scan & Cook</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
