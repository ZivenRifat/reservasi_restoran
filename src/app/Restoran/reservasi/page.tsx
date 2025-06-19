'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, X, Search, Filter } from 'lucide-react'; // Import icons

// --- Constants ---
const API_BASE_URL = 'http://127.0.0.1:8000/api/penyedia';
const AUTH_TOKEN = 'AmA7kXOEfuiVCO1ZiUj0C5En34u7RxiSODn96EIv19bf6872';

// --- Types ---
interface ReservasiItem {
  id: string;
  nama_pemesan: string; // Sesuai JSON
  tanggal: string; // Misal: "Friday, 20 June 2025"
  waktu: string; // Misal: "20:00:00"
  nomor_kursi: number; // Sesuai JSON
  status: 'Menunggu' | 'Dikonfirmasi' | 'Dibatalkan' | 'Selesai'; // Menyesuaikan dengan 'Menunggu' dan menambahkan kemungkinan lain
  // Jika ada field lain seperti noHp, email, namaRestoran di API detail, tambahkan di sini:
  // noHp?: string;
  // email?: string;
  // namaRestoran?: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ReservasiItem | null;
  onUpdateStatus: (id: string, newStatus: ReservasiItem['status']) => void; // Mengirim status baru
}

// --- DetailModal Component (re-named from Modal for clarity) ---
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, item, onUpdateStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when modal opens or item changes
    if (isOpen) {
      setError(null);
    }
  }, [isOpen, item]);

  const handleKonfirmasi = async () => {
    if (!item || item.status === 'Dikonfirmasi') return; // Prevent double confirmation

    setIsLoading(true);
    setError(null);
    try {
      // Perhatikan URL dan method: PUT ke endpoint konfirmasi
      const response = await fetch(`${API_BASE_URL}/reservasi/konfirmasi/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Konfirmasi successful:', result);
      // Panggil onUpdateStatus dengan status baru
      onUpdateStatus(item.id, 'Dikonfirmasi'); // Asumsi status berubah jadi 'Dikonfirmasi'
      onClose(); // Tutup modal setelah berhasil
    } catch (err: any) {
      console.error('Error confirming reservation:', err);
      setError(`Gagal mengkonfirmasi reservasi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatalkan = async () => {
    if (!item || item.status === 'Dibatalkan') return; // Prevent double cancellation

    if (!window.confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Perhatikan URL dan method: DELETE ke endpoint batalkan
      const response = await fetch(`${API_BASE_URL}/reservasi/batalkan/${item.id}`, {
        method: 'DELETE', // DELETE method
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json', // Minta JSON response
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      console.log('Pembatalan successful');
      // Panggil onUpdateStatus dengan status baru
      onUpdateStatus(item.id, 'Dibatalkan'); // Asumsi status berubah jadi 'Dibatalkan'
      onClose(); // Tutup modal setelah berhasil dibatalkan
    } catch (err: any) {
      console.error('Error canceling reservation:', err);
      setError(`Gagal membatalkan reservasi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCetak = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detail Reservasi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {isLoading && <p className="text-blue-600 mb-4">Memproses...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {item ? (
          <>
            <div className="text-left space-y-2 mb-6">
              <p><strong>Nama Pemesan:</strong> {item.nama_pemesan}</p>
              {/* Jika noHp, email, namaRestoran ada di JSON detail, uncomment ini */}
              {/* {item.noHp && <p><strong>No HP:</strong> {item.noHp}</p>} */}
              {/* {item.email && <p><strong>Email:</strong> {item.email}</p>} */}
              {/* {item.namaRestoran && <p><strong>Nama Restoran:</strong> {item.namaRestoran}</p>} */}
              <p><strong>Tanggal:</strong> {item.tanggal}</p>
              <p><strong>Waktu:</strong> {item.waktu}</p>
              <p><strong>Nomor Kursi:</strong> {item.nomor_kursi}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${
                item.status === 'Dikonfirmasi' ? 'text-green-600' :
                item.status === 'Menunggu' ? 'text-yellow-600' :
                item.status === 'Dibatalkan' ? 'text-red-600' : 'text-gray-600'
              }`}>{item.status}</span></p>
            </div>

            {/* Aksi berdasarkan status */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              {item.status === 'Menunggu' && (
                <>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleKonfirmasi}
                    disabled={isLoading}
                  >
                    Konfirmasi
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBatalkan}
                    disabled={isLoading}
                  >
                    Batalkan
                  </button>
                </>
              )}

              {item.status === 'Dikonfirmasi' && (
                <>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={handleCetak}
                  >
                    Cetak Nota
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBatalkan} // Masih bisa dibatalkan jika sudah dikonfirmasi
                    disabled={isLoading}
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

              {/* Tombol Tutup selalu ada */}
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isLoading}
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

// --- ReservasiPage Component ---
const KelolaReservasiPage: React.FC = () => {
  const [reservations, setReservations] = useState<ReservasiItem[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservasiItem[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState<ReservasiItem | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const fetchReservations = useCallback(async () => {
    setIsLoadingList(true);
    setErrorList(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reservasi`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setReservations(data.data || []); // Pastikan membaca dari data.data
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setErrorList(`Gagal memuat daftar reservasi: ${err.message}`);
      setReservations([]);
    } finally {
      setIsLoadingList(false);
    }
  }, []); // Dependensi kosong karena tidak ada variabel eksternal yang dibutuhkan

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Effect untuk filtering data setiap kali data reservasi, search term, atau filter status berubah
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
    setSelectedReservasi(item);
    setShowDetailModal(true);

    
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedReservasi(null);
  };

  // Fungsi ini dipanggil dari Modal ketika status reservasi diperbarui (konfirmasi/batalkan)
  const handleReservationStatusUpdate = (id: string, newStatus: ReservasiItem['status']) => {
    // Update status di daftar `reservations` secara lokal
    setReservations(prevReservations =>
      prevReservations.map(res =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    );
    // Tutup modal setelah update jika tidak otomatis tertutup di modal
    setShowDetailModal(false);
    setSelectedReservasi(null); // Clear selected item
    // fetchReservations(); // Opsi: re-fetch semua data untuk memastikan konsistensi
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Reservasi</h1>
          <p className="text-gray-600 mt-1">Pantau dan kelola semua reservasi yang masuk.</p>
        </div>

        

        {/* Tabel Reservasi */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoadingList ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Memuat daftar reservasi...</p>
            </div>
          ) : errorList ? (
            <div className="p-8 text-center text-red-500">
              <p>{errorList}</p>
              <button
                onClick={fetchReservations}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Coba Lagi
              </button>
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
                        <div className="text-sm text-gray-900">{res.tanggal}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{res.waktu.substring(0, 5)}</div> {/* Hanya ambil HH:MM */}
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
                              : 'bg-gray-100 text-gray-800' // 'Selesai'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                          onClick={() => handleDetailClick(res)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination - Anda perlu mengimplementasikan logika pagination nyata jika API Anda mendukungnya */}
              {/* Ini hanyalah placeholder */}
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

      {/* Modal */}
      <DetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        item={selectedReservasi}
        onUpdateStatus={handleReservationStatusUpdate}
      />
    </div>
  );
};

export default KelolaReservasiPage;