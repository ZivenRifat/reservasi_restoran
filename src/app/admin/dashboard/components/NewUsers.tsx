'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nama: string;
  email: string;
  no_hp?: string;
  peran?: string;
  created_at?: string;
}

interface Props {
  token: string;
  onTotalChange?: (total: number) => void;
  onAuthError?: () => void;
}

export function NewUsers({ token, onTotalChange = () => {}, onAuthError = () => {} }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      if (!token || token.trim() === '') {
        setError('Token tidak valid atau kosong');
        setUsers([]);
        onTotalChange(0);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/api/admin/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          setError('Sesi telah berakhir. Silakan login kembali.');
          onAuthError();
          return;
        }

        const data = await res.json();
        const userList: User[] = Array.isArray(data?.data) ? data.data : [];

        setUsers(userList);
        onTotalChange(userList.length);
      } catch (err) {
        setError('Gagal mengambil data user.');
        setUsers([]);
        onTotalChange(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDetailClick = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-800">User Baru</h2>
          </div>
          <button
            onClick={() => router.push('/admin/manajemenUser')}
            className="bg-[#6A1B1A] hover:bg-[#8B2C2B] text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-1 shadow-sm"
          >
            <span>Lihat Semua</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
              <span>Memuat data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex flex-col items-center space-y-2 text-gray-500">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Belum ada data user</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className={`group flex justify-between items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                  index % 2 === 0 ? 'bg-white border-gray-100' : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.nama}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleDetailClick(user)}
                  className="bg-[#6A1B1A] hover:bg-[#8B2C2B] text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-sm hover:shadow-md"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.nama.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Detail User</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Nama Lengkap</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.nama}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">No. Handphone</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.no_hp || 'Tidak tersedia'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Peran</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.peran || 'Tidak tersedia'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v-2m0 0V9m0 2H8m4 0h4" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Tanggal Bergabung</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.created_at || 'Tidak tersedia'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}