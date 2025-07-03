// components/RestaurantSidebar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Asumsi MenuItem dan LogoutModal berada di folder yang sama atau diakses via path ini
import MenuItem from './MenuItem';
import LogoutModal from './LogoutModal';

export default function RestaurantSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    role: 'Loading...',
  });

  // Effect untuk mengecek apakah di client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect untuk mengatur info pengguna (spesifik untuk restoran)
  useEffect(() => {
    if (isClient) {
      // Info pengguna untuk Restoran
      setUserInfo({
        name: 'Manager Restoran', // Sesuaikan dengan nama manajer restoran yang sebenarnya
        role: 'Restaurant Manager',
      });
    }
  }, [isClient]);

  // Menu items khusus untuk Restoran
  const restoranMenuItems = [
    {
      label: 'Dashboard',
      href: '/Restoran/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      label: 'Manajemen Meja',
      href: '/Restoran/manajemenMeja',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Kelola Reservasi',
      href: '/Restoran/reservasi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Kelola Menu',
      href: '/Restoran/kelolaMenu',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Lihat Ulasan',
      href: '/Restoran/ulasan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: 'Pengaturan',
      href: '/Restoran/pengaturan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const handleLogout = useCallback(() => {
    if (isClient) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      router.replace('/login');
    }
  }, [router, isClient]);

  // Jangan render sampai client side
  if (!isClient) {
    return null;
  }

  return (
    <div className="w-64 bg-[#481111] shadow-lg h-screen text-white fixed top-0 left-0 z-40 hidden md:flex md:flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-[#6a1b1b]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 tracking-wide">
            Restaurant Panel
          </h2>
          <div className="relative">
            {/* User Icon */}
            <div className="w-20 h-20 rounded-full bg-[#6a1b1b] mx-auto border-3 border-white shadow-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 font-medium text-sm">{userInfo.name}</p>
          <p className="text-xs text-gray-300 opacity-75">{userInfo.role}</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {restoranMenuItems.map((item, index) => (
            <MenuItem // Menggunakan komponen MenuItem
              key={index}
              label={item.label}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-[#6a1b1b]">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group hover:bg-[#6a1b1b] hover:shadow-sm hover:translate-x-1"
        >
          <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 013-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200">
            Logout
          </span>
        </button>
      </div>

      {/* Modal Konfirmasi Logout */}
      <LogoutModal // Menggunakan komponen LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}