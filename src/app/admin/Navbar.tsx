'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen = false }: NavbarProps) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Judul halaman berdasarkan route admin dengan breadcrumb
  const titles: Record<string, { title: string; breadcrumb: string[] }> = {
    '/admin/dashboard': { 
      title: 'Dashboard', 
      breadcrumb: ['Admin', 'Dashboard'] 
    },
    '/admin/manajemenUser': { 
      title: 'Manajemen User', 
      breadcrumb: ['Admin', 'Manajemen User'] 
    },
    '/admin/manajemenWeb': { 
      title: 'Manajemen Website', 
      breadcrumb: ['Admin', 'Manajemen Website'] 
    },
    '/admin/profil': { 
      title: 'Profil Admin', 
      breadcrumb: ['Admin', 'Profil'] 
    },
  };

  // Cocokkan path sekarang dengan daftar judul
  const matchedPath = Object.keys(titles).find((path) => pathname.startsWith(path));
  const pageInfo = matchedPath ? titles[matchedPath] : { 
    title: 'Admin Panel', 
    breadcrumb: ['Admin'] 
  };

  // Mock notifications data
  const notifications = [
    { id: 1, message: 'User baru mendaftar', time: '2 menit yang lalu', unread: true },
    { id: 2, message: 'Reservasi baru diterima', time: '15 menit yang lalu', unread: true },
    { id: 3, message: 'Update sistem berhasil', time: '1 jam yang lalu', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Left Section - Mobile Menu & Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Page Title & Breadcrumb */}
            <div>
              {/* Breadcrumb */}
              <nav className="hidden sm:flex text-sm text-gray-500 mb-1">
                {pageInfo.breadcrumb.map((crumb, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <span className={index === pageInfo.breadcrumb.length - 1 ? 'text-[#481111] font-medium' : ''}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
              
              {/* Page Title */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {pageInfo.title}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Box - Hidden on mobile */}
            <div className="relative hidden md:block">
              
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-[#481111] hover:text-[#6a1b1b] font-medium transition-colors duration-200">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-gray-900">Rindi Fadilah</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              {/* Avatar */}
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-200 hover:ring-[#481111] transition-all duration-200"
                onClick={() => setShowModal(true)}
              >
                <img
                  src="/FotoProfil.jpg"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}

      {/* Profile Modal */}
    </>
  );
}