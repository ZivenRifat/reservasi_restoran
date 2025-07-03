import Sidebar from '../components/SidebarRestaurant';
import Navbar from '../components/Navbar';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      {/* Sidebar yang tetap di sisi kiri */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Sidebar />
      </div>

      {/* Konten utama */}
      <div className="ml-64 flex-1 flex flex-col h-screen">
        <Navbar />

        {/* Area konten yang bisa di-scroll */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
