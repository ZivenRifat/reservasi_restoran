'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Search, Filter, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from 'cookies-next';

// --- Types ---
interface ReservasiItem {
  id: string;
  nama_pemesan: string;
  tanggal: string; // Keep as string, will format for display
  waktu: string;
  nomor_kursi: number;
  status: 'Menunggu' | 'Dikonfirmasi' | 'Dibatalkan' | 'Selesai';
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ReservasiItem | null;
  onUpdateStatus: (id: string, newStatus: ReservasiItem['status']) => void;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  isParentLoading: boolean;
  authToken: string | undefined;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// --- DetailModal Component ---
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, item, onUpdateStatus, showNotification, isParentLoading, authToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen, item]);

  const isAnyLoading = isLoading || isParentLoading;

  const handleAuthenticationError = useCallback(() => {
    showNotification('Sesi Anda telah berakhir. Mohon login ulang.', 'error');
    deleteCookie('auth_token');
    // Karena modal tidak punya akses router secara langsung, biarkan parent yang redirect
    // (Parent sudah memiliki logic redirect setelah showNotification)
  }, [showNotification]);


  const handleKonfirmasi = async () => {
    if (!item || item.status === 'Dikonfirmasi') return;
    if (!authToken) {
      handleAuthenticationError();
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // PERBAIKAN: Tambahkan /api/penyedia/reservasi/
      const response = await fetch(`${API_BASE_URL}/api/penyedia/reservasi/konfirmasi/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        handleAuthenticationError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Konfirmasi successful:', result);
      showNotification('Reservasi berhasil dikonfirmasi!', 'success');
      onUpdateStatus(item.id, 'Dikonfirmasi');
      onClose();
    } catch (err: any) {
      console.error('Error confirming reservation:', err);
      setError(`Gagal mengkonfirmasi reservasi: ${err.message}`);
      showNotification(`Gagal mengkonfirmasi: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatalkan = async () => {
    if (!item || item.status === 'Dibatalkan') return;
    if (!authToken) {
      handleAuthenticationError();
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // PERBAIKAN: Tambahkan /api/penyedia/reservasi/
      const response = await fetch(`${API_BASE_URL}/api/penyedia/reservasi/batalkan/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthenticationError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      console.log('Pembatalan successful');
      showNotification('Reservasi berhasil dibatalkan!', 'success');
      onUpdateStatus(item.id, 'Dibatalkan');
      onClose();
    } catch (err: any) {
      console.error('Error canceling reservation:', err);
      setError(`Gagal membatalkan reservasi: ${err.message}`);
      showNotification(`Gagal membatalkan: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCetak = () => {
    window.print();
    showNotification('Mencetak nota...', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detail Reservasi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {isAnyLoading && <p className="text-blue-600 mb-4">Memproses...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!authToken && (
            <p className="text-red-500 mb-4">Token autentikasi tidak ditemukan. Harap login kembali.</p>
        )}

        {item ? (
          <>
            <div className="text-left space-y-2 mb-6">
              <p><strong>Nama Pemesan:</strong> {item.nama_pemesan}</p>
              <p><strong>Tanggal:</strong> {formatDate(item.tanggal)}</p>
              <p><strong>Waktu:</strong> {item.waktu.substring(0, 5)}</p>
              <p><strong>Nomor Kursi:</strong> {item.nomor_kursi}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${
                item.status === 'Dikonfirmasi' ? 'text-green-600' :
                item.status === 'Menunggu' ? 'text-yellow-600' :
                item.status === 'Dibatalkan' ? 'text-red-600' : 'text-gray-600'
              }`}>{item.status}</span></p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              {item.status === 'Menunggu' && (
                <>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleKonfirmasi}
                    disabled={isAnyLoading || !authToken}
                  >
                    Konfirmasi
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBatalkan}
                    disabled={isAnyLoading || !authToken}
                  >
                    Batalkan
                  </button>
                </>
              )}

              {item.status === 'Dikonfirmasi' && (
                <>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCetak}
                    disabled={isAnyLoading}
                  >
                    Cetak Nota
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBatalkan}
                    disabled={isAnyLoading || !authToken}
                  >
                    Batalkan
                  </button>
                </>
              )}

              {(item.status === 'Dibatalkan' || item.status === 'Selesai') && (
                <p className={`font-semibold ${item.status === 'Dibatalkan' ? 'text-red-600' : 'text-gray-600'}`}>
                  Reservasi ini telah {item.status.toLowerCase()}.
                </p>
              )}

              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isAnyLoading}
              >
                Tutup
              </button>
            </div>
          </>
        ) : (
          <p>Data reservasi tidak tersedia.</p>
        )}
      </div>
    </div>
  );
};


// --- KelolaReservasiPage Component ---
const KelolaReservasiPage: React.FC = () => {
  const [reservations, setReservations] = useState<ReservasiItem[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservasiItem[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState<ReservasiItem | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: '' });

  const router = useRouter();

  const API_BASE_URL_ENV = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const [authToken, setAuthToken] = useState<string | undefined>(undefined);


  // --- Fungsi showNotification dideklarasikan lebih awal ---
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);


  // --- Helper untuk mengambil token dari cookie ---
  const retrieveAuthToken = useCallback(async () => {
    const token = await getCookie('auth_token');
    if (typeof token === 'string') {
      setAuthToken(token);
    } else {
      setAuthToken(undefined);
      showNotification('Sesi berakhir, mohon login ulang.', 'error');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  }, [showNotification, router]);


  // --- Effect untuk mengambil token saat komponen mount ---
  useEffect(() => {
    retrieveAuthToken();
  }, [retrieveAuthToken]);


  // --- Fungsi Fetch Reservasi ---
  const fetchReservations = useCallback(async () => {
    if (authToken === undefined) {
      setIsLoadingList(true);
      return;
    }
    if (!authToken) {
      setErrorList('Autentikasi diperlukan. Mohon login.');
      setIsLoadingList(false);
      setReservations([]);
      setFilteredReservations([]);
      return;
    }

    setIsLoadingList(true);
    setErrorList(null);
    try {
      // PERBAIKAN: Tambahkan /api/penyedia/reservasi
      const response = await fetch(`${API_BASE_URL_ENV}/api/penyedia/reservasi`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        showNotification('Sesi berakhir, mohon login ulang.', 'error');
        deleteCookie('auth_token');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setReservations(data.data);
      } else if (Array.isArray(data)) {
        setReservations(data);
      } else {
        console.warn('Unexpected API response structure:', data);
        setReservations([]);
        setErrorList('Struktur data dari API tidak sesuai.');
      }
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      let errorMessage = 'Gagal memuat daftar reservasi.';
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage += ' Pastikan server backend berjalan dan CORS dikonfigurasi dengan benar.';
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      setErrorList(errorMessage);
      setReservations([]);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoadingList(false);
    }
  }, [API_BASE_URL_ENV, authToken, showNotification, router]);

  useEffect(() => {
    if (authToken !== undefined) {
      fetchReservations();
    }
  }, [fetchReservations, authToken]);

  useEffect(() => {
    let currentFiltered = reservations;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(item =>
        item.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'Semua') {
      currentFiltered = currentFiltered.filter(item => item.status === statusFilter);
    }

    setFilteredReservations(currentFiltered);
  }, [reservations, searchTerm, statusFilter]);


  const handleDetailClick = async (item: ReservasiItem) => {
    if (!authToken) {
      showNotification('Autentikasi diperlukan untuk melihat detail reservasi. Mohon login.', 'error');
      return;
    }
    setSelectedReservasi(item);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedReservasi(null);
  };

  const handleReservationStatusUpdate = (id: string, newStatus: ReservasiItem['status']) => {
    setReservations(prevReservations =>
      prevReservations.map(res =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    );
    setShowDetailModal(false);
    setSelectedReservasi(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notifikasi */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Reservasi</h1>
          <p className="text-gray-600 mt-1">Pantau dan kelola semua reservasi yang masuk.</p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama pemesan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isLoadingList || !authToken}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isLoadingList || !authToken}
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Dikonfirmasi">Dikonfirmasi</option>
                <option value="Dibatalkan">Dibatalkan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Reservasi */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {authToken === undefined ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Memuat sesi autentikasi...</p>
            </div>
          ) : isLoadingList ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Memuat daftar reservasi...</p>
            </div>
          ) : errorList ? (
            <div className="p-8 text-center text-red-500">
              <p>{errorList}</p>
              {errorList.includes('Autentikasi diperlukan') || errorList.includes('Sesi berakhir') ? (
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Login Sekarang
                </button>
              ) : (
                <button
                  onClick={fetchReservations}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Tidak ada reservasi yang ditemukan dengan kriteria ini.</p>
              {searchTerm || statusFilter !== 'Semua' ? (
                <button
                  onClick={() => { setSearchTerm(''); setStatusFilter('Semua'); }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Reset Filter
                </button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemesan</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kursi</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{res.nama_pemesan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(res.tanggal)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{res.waktu.substring(0, 5)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{res.nomor_kursi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            res.status === 'Dikonfirmasi'
                              ? 'bg-green-100 text-green-800'
                              : res.status === 'Menunggu'
                              ? 'bg-yellow-100 text-yellow-800'
                              : res.status === 'Dibatalkan'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDetailClick(res)}
                          disabled={!authToken}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end items-center mt-4 space-x-2 text-sm p-4">
                <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>&lt;&lt;</button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 bg-gray-200" disabled>2</button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>...</button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>&gt;&gt;</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        item={selectedReservasi}
        onUpdateStatus={handleReservationStatusUpdate}
        showNotification={showNotification}
        isParentLoading={isLoadingList}
        authToken={authToken}
      />
    </div>
  );
};

export default KelolaReservasiPage;