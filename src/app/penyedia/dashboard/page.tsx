// src/app/Restoran/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Clock, Users, X, Printer, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import components (path disesuaikan menjadi relatif)
import OperationalSettings from './components/OperationalSettings';
import DetailReservasiModal from './components/DetailReservasiModal';
import ReservasiTerbaruTable from './components/ReservasiTerbaruTable';
import StatsCard from './components/StatsCard';

// Import types and API service (path disesuaikan ke level global components)
import { DashboardData, Reservasi } from '../../../Components/types';
import { restaurantApi } from '../../../Components/api/restaurantAPI';

const RestaurantDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReservasi, setSelectedReservasi] = useState<Reservasi | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCetakNota, setShowCetakNota] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await restaurantApi.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error.message);
      // Mock data for demonstration - Hapus ini saat production
      setDashboardData({
        total_pelanggan: 120,
        total_reservasi: 50,
        total_dibatalkan: 5,
        reservasi_terbaru: [
          {
            id: '1',
            nama: 'Rindi Fitria',
            jumlah_orang: 4,
            waktu: '20:00',
            tanggal: '2025-06-19',
            nomor_meja: 3,
            status: 'pending',
            no_telepon: '081234567890',
            catatan: 'Permintaan meja dekat jendela'
          },
          {
            id: '2',
            nama: 'Budi Santoso',
            jumlah_orang: 2,
            waktu: '19:00',
            tanggal: '2025-06-19',
            nomor_meja: 1,
            status: 'confirmed',
            no_telepon: '087654321098',
            catatan: 'Perayaan ulang tahun kecil'
          },
          {
            id: '3',
            nama: 'Citra Dewi',
            jumlah_orang: 5,
            waktu: '18:30',
            tanggal: '2025-06-18',
            nomor_meja: 5,
            status: 'cancelled',
            no_telepon: '089876543210',
            catatan: 'Ada keperluan mendadak'
          },
          {
            id: '4',
            nama: 'Andi Pratama',
            jumlah_orang: 3,
            waktu: '21:00',
            tanggal: '2025-06-20',
            nomor_meja: 2,
            status: 'pending',
            no_telepon: '085432109876',
            catatan: 'Meja non-smoking'
          },
        ],
        status: 'buka',
        jam_operasional: {
          id: '01978304-28c3-7154-8ff4-fc8c308dbc19',
          restoran_id: 'aea3756e-5309-41b4-869e-935d80c35b72',
          jam_buka: '08:00:00',
          jam_tutup: '23:00:00',
          created_at: '2025-06-18T12:29:37.000000Z',
          updated_at: '2025-06-18T12:29:37.000000Z'
        }
      });
      alert(`Gagal memuat data dashboard: ${error.message}. Menggunakan data contoh.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (reservasi: Reservasi) => {
    setSelectedReservasi(reservasi);
    setShowDetailModal(true);
    setShowCetakNota(false);
  };

  const updateReservationStatusInState = (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setDashboardData(prev => {
      if (!prev) return null;

      const updatedReservasi = prev.reservasi_terbaru.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      );

      let newTotalReservasi = prev.total_reservasi;
      let newTotalDibatalkan = prev.total_dibatalkan;

      const oldReservasi = prev.reservasi_terbaru.find(r => r.id === id);

      if (oldReservasi) {
        if (oldReservasi.status !== 'cancelled' && newStatus === 'cancelled') {
          newTotalDibatalkan += 1;
        }
      }

      return {
        ...prev,
        reservasi_terbaru: updatedReservasi,
        total_reservasi: newTotalReservasi,
        total_dibatalkan: newTotalDibatalkan,
      };
    });
    setSelectedReservasi(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleKonfirmasi = async (id: string) => {
    try {
      await restaurantApi.konfirmasiReservasi(id);
      updateReservationStatusInState(id, 'confirmed');
      setShowCetakNota(true);
      await loadDashboard();
      alert('Reservasi berhasil dikonfirmasi!');
    } catch (error: any) {
      console.error('Error confirming reservation:', error.message);
      alert(`Gagal mengkonfirmasi reservasi: ${error.message}`);
    }
  };

  const handleBatalkan = async (id: string) => {
    try {
      await restaurantApi.batalkanReservasi(id);
      updateReservationStatusInState(id, 'cancelled');
      setShowCetakNota(false);
      await loadDashboard();
      alert('Reservasi berhasil dibatalkan!');
    } catch (error: any) {
      console.error('Error cancelling reservation:', error.message);
      alert(`Gagal membatalkan reservasi: ${error.message}`);
    }
  };

  const handleLihatSemua = () => {
    router.push('/Restoran/reservasi');
  };

  const handleUpdateStatus = async (newStatus: 'buka' | 'tutup') => {
    if (!dashboardData || !dashboardData.jam_operasional || !dashboardData.jam_operasional.restoran_id) {
      alert('Data restoran atau ID restoran tidak tersedia. Tidak dapat memperbarui status.');
      return;
    }
    const restoranId = dashboardData.jam_operasional.restoran_id;

    const statusToSend = newStatus === 'buka' ? 1 : 0;

    console.log('DEBUG: Mengirim PUT untuk restoranId:', restoranId);
    console.log('DEBUG: Mengirim status (sebagai angka):', statusToSend);

    try {
      const response = await restaurantApi.updateOperasional(restoranId, { status: statusToSend });

      const updatedStatusFromBackend = response.data.data.status === 1 ? 'buka' : 'tutup';
      console.log('DEBUG: Status dari backend:', response.data.data.status, 'dikonversi menjadi:', updatedStatusFromBackend);

      setDashboardData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: updatedStatusFromBackend
        };
      });
      alert('Status operasional berhasil diperbarui!');
    } catch (error: any) {
      console.error('Error updating operational status:', error.message);
      alert(`Gagal memperbarui status operasional: ${error.message}.`);
    }
  };

  const handleUpdateJamOperasional = async (jamBuka: string, jamTutup: string) => {
    if (!dashboardData || !dashboardData.jam_operasional || !dashboardData.jam_operasional.restoran_id) {
      alert('Data restoran atau ID restoran tidak tersedia. Tidak dapat memperbarui jam operasional.');
      return;
    }
    const restoranId = dashboardData.jam_operasional.restoran_id;

    const formattedJamBuka = `${jamBuka}:00`;
    const formattedJamTutup = `${jamTutup}:00`;

    console.log('DEBUG: Mengirim PUT untuk restoranId:', restoranId);
    console.log('DEBUG: Mengatur jam buka:', formattedJamBuka, 'jam tutup:', formattedJamTutup);

    try {
      await restaurantApi.updateOperasional(restoranId, { jam_buka: formattedJamBuka, jam_tutup: formattedJamTutup });
      await loadDashboard();
      alert('Jam operasional berhasil diperbarui!');
    } catch (error: any) {
      console.error('Error updating operational hours:', error.message);
      alert(`Gagal memperbarui jam operasional: ${error.message}.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Gagal memuat data dashboard</p>
          <button
            onClick={loadDashboard}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Restoran</h1>
          <p className="text-gray-600">Kelola operasional dan reservasi restoran Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatsCard
            title="Total Pelanggan"
            value={dashboardData.total_pelanggan}
            icon={Users}
            color="bg-blue-600"
          />
          <StatsCard
            title="Total Reservasi"
            value={dashboardData.total_reservasi}
            icon={Clock}
            color="bg-green-600"
          />
          <StatsCard
            title="Total Dibatalkan"
            value={dashboardData.total_dibatalkan}
            icon={X}
            color="bg-red-600"
          />
        </div>

        {/* Operational Settings */}
        <div className="mb-8">
          <OperationalSettings
            status={dashboardData.status}
            jamOperasional={dashboardData.jam_operasional}
            onUpdateStatus={handleUpdateStatus}
            onUpdateJamOperasional={handleUpdateJamOperasional}
          />
        </div>

        {/* Reservasi Terbaru Table */}
        <ReservasiTerbaruTable
          reservasi={dashboardData.reservasi_terbaru || []}
          onDetailClick={handleDetailClick}
          onLihatSemua={handleLihatSemua}
        />

        {/* Detail Modal */}
        <DetailReservasiModal
          reservasi={selectedReservasi}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setShowCetakNota(false);
            setSelectedReservasi(null);
          }}
          onKonfirmasi={handleKonfirmasi}
          onBatalkan={handleBatalkan}
          showCetakNota={showCetakNota}
        />
      </div>
    </div>
  );
};

export default RestaurantDashboard;