import { Outlet } from 'react-router';
import BottomNav from '~/components/bottom-nav/bottom-nav';
import Navigation from '~/components/navigation/navigation';

export default function AppLayout() {
  return (
    <div className="">
      {/* <Navigation /> */}
      <div className="h-16 w-full mx-auto bg-pink-100 items-center flex justify-center sticky top-0 z-10">
        <h1 className="text-center text-pink-800 text-2xl font-bold">
          Scan & Cook
        </h1>
      </div>
      <Outlet />
      <BottomNav />
    </div>
  );
}
