import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
export default function ManajemenUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar dengan lebar tetap */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Area konten utama */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
