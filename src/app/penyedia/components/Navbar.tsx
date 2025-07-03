'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Effect untuk mengecek apakah di client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const titles: Record<string, string> = {
    '/penyedia/dashboard': 'Dashboard',
    '/penyedia/manajemenMeja': 'Manajemen Meja',
    '/penyedia/reservasi': 'Kelola Reservasi',
    '/penyedia/kelolaMenu': 'Kelola Menu',
    '/penyedia/pengaturan': 'Pengaturan',
    '/penyedia/ulasan': 'Ulasan',
    '/penyedia/logout': 'Logout',
  };

  // Dukung path dinamis (misalnya /pengaturan/edit)
  const matchedPath = Object.keys(titles).find((path) => pathname.startsWith(path));
  const title = matchedPath ? titles[matchedPath] : '';

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      router.replace('/login');
    }
  };

  return (
    <>
      <div className="bg-white px-6 py-4 shadow flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        {/* Right Section */}
        <div className="flex items-center gap-4">
         

          {/* Notification */}
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          </div>

          {/* User Profile Icon */}
          

          {/* Logout Button - Only show when client is ready */}
          {isClient && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal - Only render on client */}
      {isClient && showLogoutConfirm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Logout
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Apakah Anda yakin ingin keluar dari sistem?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}