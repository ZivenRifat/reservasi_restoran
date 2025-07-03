<<<<<<< HEAD
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
=======
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye, Clock, Users, X, Printer, ArrowRight, RefreshCw, AlertCircle, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from 'cookies-next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Components dari folder yang sama
import StatsCard from './components/StatsCard';
import DetailReservasiModal, { Reservasi } from './components/DetailReservasiModal';
import OperationalSettings, { JamOperasional } from './components/OperationalSettings';
import ReservasiTerbaruTable from './components/ReservasiTerbaruTable';



export interface DashboardData {
  total_pelanggan: number;
  total_reservasi: number;
  total_dibatalkan: number;
  reservasi_terbaru: Reservasi[];
  status: 'buka' | 'tutup';
  jam_operasional: JamOperasional | null;
}


export interface ApiResponse {
  status: string;
  message: string;
  data: any;
}


interface UpdateOperationalRequest {
  jam_buka?: string;
  jam_tutup?: string;
}


interface UpdateOperationalResponse {
  status: string;
  message: string;
  data: {
    status: number;
    jam_operasional: {
      restoran_id: string;
      jam_buka: string;
      jam_tutup: string;
      id: string;
      updated_at: string;
      created_at: string;
    };
  };
}


const MOCK_DASHBOARD_DATA: DashboardData = {
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
};


const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL not set, using default localhost:8000');
    return 'http://localhost:8000';
  }
  return apiUrl.replace(/\/$/, '');
};

const BASE_API_URL = getApiUrl();


const RestaurantDashboard: React.FC = () => {
 
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState<Reservasi | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCetakNota, setShowCetakNota] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const router = useRouter();

  
  const isRestaurantOpen = useCallback((jamOperasional: JamOperasional | null): 'buka' | 'tutup' => {
    if (!jamOperasional?.jam_buka || !jamOperasional?.jam_tutup) {
      return 'tutup';
    }

    try {
      const now = new Date();
      let currentTime = now.getHours() * 60 + now.getMinutes();

      const [openHour, openMinute] = jamOperasional.jam_buka.split(':').map(Number);
      const [closeHour, closeMinute] = jamOperasional.jam_tutup.split(':').map(Number);

      const openTime = openHour * 60 + openMinute;
      let closeTime = closeHour * 60 + closeMinute;

      if (closeTime < openTime) {
        closeTime += 24 * 60;
        if (currentTime < openTime) {
          currentTime += 24 * 60;
        }
      }

      return (currentTime >= openTime && currentTime <= closeTime) ? 'buka' : 'tutup';
    } catch (error) {
      console.error("Error parsing operational hours:", error);
      return 'tutup';
    }
  }, []);

  
  const request = useCallback(async (endpoint: string, options: RequestInit = {}): Promise<ApiResponse> => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('API calls only available in browser environment');
      }

      const token = getCookie('auth_token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const fullUrl = `${BASE_API_URL}${cleanEndpoint}`;
      
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        mode: 'cors',
        signal: AbortSignal.timeout(30000), 
      };

      const response = await fetch(fullUrl, requestOptions);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          
          if (errorData.errors && typeof errorData.errors === 'object') {
            const validationErrors = Object.values(errorData.errors).flat();
            errorMessage = validationErrors.join(', ');
          }
        } catch (parseError) {
          
        }

        if (response.status === 401) {
          throw new Error('Authentication token expired or invalid. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. You do not have permission to perform this action.');
        } else if (response.status === 404) {
          throw new Error('The requested resource was not found on the server.');
        } else if (response.status === 422) {
          throw new Error(`Validation error: ${errorMessage}`);
        } else if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
          throw new Error('Server returned HTML page instead of JSON. This usually indicates a server error.');
        }
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }

      return await response.json();

    } catch (error: any) {
      console.error('API Request failed:', {
        endpoint: cleanEndpoint,
        error: error.message
      });

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server may be unavailable or slow to respond');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error - cannot connect to server at ${BASE_API_URL}`);
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to server at ${BASE_API_URL}. Please check if the server is running.`);
      }

      throw error;
    }
  }, []);

  // --- API Methods ---
  const getDashboard = useCallback(async (): Promise<DashboardData> => {
    try {
      const response: ApiResponse = await request('/api/penyedia/dashboard');
      if (!response?.data) {
        throw new Error('Invalid response format - missing data property');
      }
      
      const data = response.data;
      return {
        total_pelanggan: Number(data.total_pelanggan) || 0,
        total_reservasi: Number(data.total_reservasi) || 0,
        total_dibatalkan: Number(data.total_dibatalkan) || 0,
        reservasi_terbaru: Array.isArray(data.reservasi_terbaru) ? data.reservasi_terbaru : [],
        status: data.status === 'buka' || data.status === 'tutup' ? data.status : 'tutup',
        jam_operasional: data.jam_operasional || null
      };
    } catch (error: any) {
      console.error('getDashboard failed:', error.message);
      throw error;
    }
  }, [request]);

  const updateOperasional = useCallback(async (
    data: UpdateOperationalRequest
  ): Promise<UpdateOperationalResponse> => {
    try {
      const updateData: any = {};
      
      if (data.jam_buka) {
        updateData.jam_buka = data.jam_buka.substring(0, 5); 
      }
      if (data.jam_tutup) {
        updateData.jam_tutup = data.jam_tutup.substring(0, 5);
      }

      const response = await request('/api/penyedia/dashboard', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      return response as UpdateOperationalResponse;
    } catch (error: any) {
      console.error('updateOperasional failed:', error.message);
      throw error;
    }
  }, [request]);

  const konfirmasiReservasi = useCallback(async (id: string): Promise<ApiResponse> => {
    try {
      if (!id) {
        throw new Error('Reservation ID is required');
      }
      return await request(`/api/penyedia/reservasi/konfirmasi/${id}`, { method: 'PUT' });
    } catch (error: any) {
      console.error('konfirmasiReservasi failed:', error.message);
      throw error;
    }
  }, [request]);

  const batalkanReservasi = useCallback(async (id: string): Promise<ApiResponse> => {
    try {
      if (!id) {
        throw new Error('Reservation ID is required');
      }
      return await request(`/api/penyedia/reservasi/batalkan/${id}`, { method: 'PUT' });
    } catch (error: any) {
      console.error('batalkanReservasi failed:', error.message);
      throw error;
    }
  }, [request]);

  // --- Event Handlers ---
  const handleAuthError = useCallback((message: string) => {
    console.log('Auth error occurred, redirecting to login:', message);
    setError(message);
    deleteCookie('auth_token');
    toast.error(message);
    setTimeout(() => router.push('/login'), 2000);
  }, [router]);

  const loadDashboard = useCallback(async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      setError('');
      
      const data = await getDashboard();
      const calculatedStatus = isRestaurantOpen(data.jam_operasional);
      
      setDashboardData({
        ...data,
        status: calculatedStatus
      });
      setIsUsingMockData(false);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('Authentication token')) {
        handleAuthError(errorMessage);
        return;
      }
      
      setError(errorMessage);
      
      // Use mock data as fallback
      const calculatedStatusForMock = isRestaurantOpen(MOCK_DASHBOARD_DATA.jam_operasional);
      setDashboardData({
        ...MOCK_DASHBOARD_DATA,
        status: calculatedStatusForMock
      });
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [getDashboard, handleAuthError, isRestaurantOpen]);

  const updateReservationStatusInState = useCallback((id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setDashboardData((prev: DashboardData | null) => {
      if (!prev) return null;
      
      const updatedReservasi = prev.reservasi_terbaru.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      );
      
      let newTotalDibatalkan = prev.total_dibatalkan;
      const oldReservasi = prev.reservasi_terbaru.find(r => r.id === id);
      
      if (oldReservasi) {
        if (oldReservasi.status !== 'cancelled' && newStatus === 'cancelled') {
          newTotalDibatalkan += 1;
        }
        if (oldReservasi.status === 'cancelled' && newStatus !== 'cancelled') {
          newTotalDibatalkan = Math.max(0, newTotalDibatalkan - 1);
        }
      }
      
      return {
        ...prev,
        reservasi_terbaru: updatedReservasi,
        total_dibatalkan: newTotalDibatalkan,
      };
    });
    
    setSelectedReservasi(prev => prev ? { ...prev, status: newStatus } : null);
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await loadDashboard();
>>>>>>> origin/main
  };

  const handleDetailClick = (reservasi: Reservasi) => {
    setSelectedReservasi(reservasi);
    setShowDetailModal(true);
    setShowCetakNota(false);
  };

<<<<<<< HEAD
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
=======
  const handleLihatSemua = useCallback(() => {
    router.push('/Restoran/reservasi');
  }, [router]);

  const handleKonfirmasi = async (id: string) => {
    if (isUsingMockData) {
      toast.warn('Menggunakan data demo - tidak dapat mengkonfirmasi reservasi sungguhan');
      return;
    }
    
    try {
      const response = await konfirmasiReservasi(id);
      updateReservationStatusInState(id, 'confirmed');
      setShowCetakNota(true);
      await loadDashboard(false);
      toast.success(response.message || 'Reservasi berhasil dikonfirmasi!');
    } catch (err: any) {
      if (err.message.includes('Authentication token')) {
        handleAuthError(err.message);
      } else {
        toast.error(`Gagal mengkonfirmasi reservasi: ${err.message || 'Error tidak diketahui'}`);
      }
>>>>>>> origin/main
    }
  };

  const handleBatalkan = async (id: string) => {
<<<<<<< HEAD
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
=======
    if (isUsingMockData) {
      toast.warn('Menggunakan data demo - tidak dapat membatalkan reservasi sungguhan');
      return;
    }
    
    try {
      const response = await batalkanReservasi(id);
      updateReservationStatusInState(id, 'cancelled');
      setShowCetakNota(false);
      await loadDashboard(false);
      toast.success(response.message || 'Reservasi berhasil dibatalkan!');
    } catch (err: any) {
      if (err.message.includes('Authentication token')) {
        handleAuthError(err.message);
      } else {
        toast.error(`Gagal membatalkan reservasi: ${err.message || 'Error tidak diketahui'}`);
      }
>>>>>>> origin/main
    }
  };

  const handleUpdateJamOperasional = async (jamBuka: string, jamTutup: string) => {
<<<<<<< HEAD
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

=======
    if (isUsingMockData) {
      toast.warn('Menggunakan data demo - tidak dapat mengubah jam operasional sungguhan');
      return;
    }
    
    if (!dashboardData?.jam_operasional?.restoran_id) {
      toast.error('Data restoran atau ID restoran tidak tersedia. Tidak dapat memperbarui jam operasional.');
      return;
    }

    try {
      const response = await updateOperasional({ jam_buka: jamBuka, jam_tutup: jamTutup });
      await loadDashboard(false);
      toast.success(response.message || 'Jam operasional berhasil diperbarui!');
    } catch (err: any) {
      if (err.message.includes('Authentication token')) {
        handleAuthError(err.message);
      } else {
        toast.error(`Gagal memperbarui jam operasional: ${err.message || 'Error tidak diketahui'}`);
      }
    }
  };

  // --- Effects ---
  useEffect(() => {
    loadDashboard();
  }, []);

  // Separate effect for status updates to avoid dependency issues
  useEffect(() => {
    if (!dashboardData?.jam_operasional) return;

    const intervalId = setInterval(() => {
      const currentCalculatedStatus = isRestaurantOpen(dashboardData.jam_operasional);
      
      setDashboardData(prev => {
        if (!prev || prev.status === currentCalculatedStatus) return prev;
        return { ...prev, status: currentCalculatedStatus };
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dashboardData?.jam_operasional, isRestaurantOpen]);

  // --- Render Logic ---
>>>>>>> origin/main
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
<<<<<<< HEAD
=======
          <p className="text-sm text-gray-500 mt-1">Server: {BASE_API_URL}</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Percobaan ke-{retryCount + 1}</p>
          )}
>>>>>>> origin/main
        </div>
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  if (!dashboardData && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Dashboard</h2>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Server: {BASE_API_URL}</p>
>>>>>>> origin/main
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Restoran</h1>
          <p className="text-gray-600">Kelola operasional dan reservasi restoran Anda</p>
=======
  const displayErrorOrWarning = isUsingMockData
    ? `Menggunakan data demo karena gagal terhubung ke server (${BASE_API_URL}): ${error}`
    : error;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Restoran</h1>
              <p className="text-gray-600">Kelola operasional dan reservasi restoran Anda</p>
              
            </div>
          </div>

          {/* Error/Warning Banner */}
          {displayErrorOrWarning && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    {isUsingMockData ? 'Menggunakan Data Demo' : 'Peringatan'}
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {displayErrorOrWarning}
                  </p>
                  {displayErrorOrWarning.includes('Authentication token') && (
                    <p className="text-sm text-yellow-700 mt-1">
                      Anda akan diarahkan ke halaman login dalam beberapa detik...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
>>>>>>> origin/main
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatsCard
            title="Total Pelanggan"
<<<<<<< HEAD
            value={dashboardData.total_pelanggan}
=======
            value={dashboardData?.total_pelanggan || 0}
>>>>>>> origin/main
            icon={Users}
            color="bg-blue-600"
          />
          <StatsCard
            title="Total Reservasi"
<<<<<<< HEAD
            value={dashboardData.total_reservasi}
=======
            value={dashboardData?.total_reservasi || 0}
>>>>>>> origin/main
            icon={Clock}
            color="bg-green-600"
          />
          <StatsCard
            title="Total Dibatalkan"
<<<<<<< HEAD
            value={dashboardData.total_dibatalkan}
=======
            value={dashboardData?.total_dibatalkan || 0}
>>>>>>> origin/main
            icon={X}
            color="bg-red-600"
          />
        </div>

        {/* Operational Settings */}
        <div className="mb-8">
<<<<<<< HEAD
          <OperationalSettings
            status={dashboardData.status}
            jamOperasional={dashboardData.jam_operasional}
            onUpdateStatus={handleUpdateStatus}
            onUpdateJamOperasional={handleUpdateJamOperasional}
          />
=======
          {dashboardData?.jam_operasional !== undefined && (
            <OperationalSettings
              status={dashboardData?.status || 'tutup'}
              jamOperasional={dashboardData?.jam_operasional || null}
              onUpdateJamOperasional={handleUpdateJamOperasional}
            />
          )}
>>>>>>> origin/main
        </div>

        {/* Reservasi Terbaru Table */}
        <ReservasiTerbaruTable
<<<<<<< HEAD
          reservasi={dashboardData.reservasi_terbaru || []}
=======
          reservasi={dashboardData?.reservasi_terbaru || []}
>>>>>>> origin/main
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