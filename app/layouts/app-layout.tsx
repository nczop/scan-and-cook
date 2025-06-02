import { Outlet } from 'react-router';
import BottomNav from '~/components/bottom-nav/bottom-nav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-pink-600">
              Scan & Cook
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}