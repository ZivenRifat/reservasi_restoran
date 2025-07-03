import Sidebar from '../components/SidebarRestaurant';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
  {/* Sidebar yang fixed dan tidak scroll bareng konten */}
  <div className="fixed top-0 left-0 h-screen w-64 z-50">
    <Sidebar />
  </div>

  
  <div className="ml-64 flex-1 flex flex-col  overflow-hidden">
    <Navbar />
    <main className="p-4">
      {children}
    </main>
  </div>
</div>
  );
}
