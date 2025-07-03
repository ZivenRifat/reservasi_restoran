'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'restoran' | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    role: 'Loading...',
  });
  const [isClient, setIsClient] = useState(false);

  // Effect untuk menandai bahwa component sudah di-mount di client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect untuk mendeteksi role dan mengatur info pengguna
  useEffect(() => {
    if (!isClient) return; // Tunggu sampai client-side rendering

    // Deteksi role dari URL path
    let detectedRole: 'admin' | 'restoran' | null = null;
    if (pathname.includes('/restoran')) {
      detectedRole = 'restoran';
    } else if (pathname.includes('/admin')) {
      detectedRole = 'admin';
    }

    // Set userRole jika berbeda
    if (detectedRole !== userRole) {
      setUserRole(detectedRole);
    }

    // Update user info berdasarkan role yang terdeteksi
    if (detectedRole === 'admin') {
      setUserInfo({
        name: 'Admin',
        role: 'Administrator',
      });
    } else if (detectedRole === 'restoran') {
      setUserInfo({
        name: 'Restoran',
        role: 'Restaurant Manager',
      });
    } else {
      // Default atau handle kasus jika role tidak terdeteksi
      setUserInfo({
        name: 'Guest',
        role: 'Unknown Role',
      });
    }
  }, [pathname, userRole, isClient]);

  // Memoize handleLogout function to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
    router.replace('/login');
  }, [router]);

  // Menu items untuk Admin
  const adminMenuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      label: 'Manajemen User',
      href: '/admin/manajemenUser',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      label: 'Manajemen Website',
      href: '/admin/manajemenWeb',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
        </svg>
      ),
    },
    {
      label: 'Profile Admin',
      href: '/admin/profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  // Menu items untuk Restoran
  const restoranMenuItems = [
    {
      label: 'Dashboard',
      href: '/restoran/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
    },
    {
      label: 'Manajemen Meja',
      href: '/restoran/manajemenMeja',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Kelola Reservasi',
      href: '/restoran/kelolaReservasi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Kelola Menu',
      href: '/restoran/kelolaMenu',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Lihat Ulasan',
      href: '/restoran/ulasan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: 'Pengaturan',
      href: '/restoran/pengaturan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Function to get user icon based on role
  const getUserIcon = () => {
    if (userRole === 'admin') {
      return (
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.8 3.3 14.4 3.2 14 3.2C13.6 3.2 13.2 3.3 13 3.5L7 7V9C7 9.6 7.4 10 8 10S9 9.6 9 9V8L12 6.7L15 8V9C15 9.6 15.4 10 16 10S17 9.6 17 9M8 11.5C8 10.7 8.7 10 9.5 10S11 10.7 11 11.5S10.3 13 9.5 13S8 12.3 8 11.5M13 11.5C13 10.7 13.7 10 14.5 10S16 10.7 16 11.5S15.3 13 14.5 13S13 12.3 13 11.5M8 16C8 14.9 8.9 14 10 14H14C15.1 14 16 14.9 16 16V18H8V16Z"/>
        </svg>
      );
    } else if (userRole === 'restoran') {
      return (
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M21,9V7L15,3.5C14.8,3.3 14.4,3.2 14,3.2C13.6,3.2 13.2,3.3 13,3.5L7,7V9C7,9.6 7.4,10 8,10S9,9.6 9,9V8L12,6.7L15,8V9C15,9.6 15.4,10 16,10S17,9.6 17,9M8,11.5C8,10.7 8.7,10 9.5,10S11,10.7 11,11.5S10.3,13 9.5,13S8,12.3 8,11.5M13,11.5C13,10.7 13.7,10 14.5,10S16,10.7 16,11.5S15.3,13 14.5,13S13,12.3 13,11.5M8,16C8,14.9 8.9,14 10,14H14C15.1,14 16,14.9 16,16V18H8V16Z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
        </svg>
      );
    }
  };

  // Pilih menu berdasarkan role yang aktif
  const menuItems = userRole === 'admin' ? adminMenuItems : restoranMenuItems;
  const panelTitle = userRole === 'admin' ? 'Admin Panel' : 'Restaurant Panel';

  // Jika belum client-side, render loading state
  if (!isClient) {
    return (
      <div className="w-64 bg-[#481111] shadow-lg h-screen text-white fixed top-0 left-0 z-40 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-[#6a1b1b]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 tracking-wide">Loading...</h2>
            <div className="w-20 h-20 rounded-full bg-[#6a1b1b] border-3 border-white shadow-lg mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="mt-3 font-medium text-sm">Loading...</p>
            <p className="text-xs text-gray-300 opacity-75">Loading...</p>
          </div>
        </div>
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#6a1b1b] animate-pulse">
                <div className="w-5 h-5 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#481111] shadow-lg h-screen text-white fixed top-0 left-0 z-40 hidden md:flex md:flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-[#6a1b1b]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 tracking-wide">
            {panelTitle}
          </h2>
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#6a1b1b] border-3 border-white shadow-lg mx-auto flex items-center justify-center">
              {getUserIcon()}
            </div>
          </div>
          <p className="mt-3 font-medium text-sm">{userInfo.name}</p>
          <p className="text-xs text-gray-300 opacity-75">{userInfo.role}</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'bg-[#6a1b1b] shadow-md border-l-4 border-white'
                    : 'hover:bg-[#6a1b1b] hover:shadow-sm hover:translate-x-1'
                }`}
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-100 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          <span className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200">
            Logout
          </span>
        </button>
      </div>

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
              Konfirmasi Logout
            </h2>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}