// FILE: RestoranTable.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ImageModal from './ImageModal';
import { CgSpinner } from 'react-icons/cg';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

// Interface untuk struktur data restoran
interface Restaurant {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  foto: string;
  is_recommended: 0 | 1;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`;
const BASE_IMAGE_SERVER_URL = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL || 'http://127.0.0.1:8000/';

const RestaurantTable: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Utility Functions
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleAuthError = useCallback(() => {
    setError('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
    deleteCookie('auth_token');
    router.push('/login');
  }, [router]);

  // Authentication
  useEffect(() => {
    const retrieveToken = async () => {
      const storedToken = await getCookie('auth_token');
      if (typeof storedToken === 'string') {
        setAuthToken(storedToken);
      } else {
        console.log('No authentication token found for RestoranTable. Redirecting to login.');
        setAuthToken(undefined);
      }
    };
    retrieveToken();
  }, []);

  // Fetch Restaurants
  const fetchRestaurants = useCallback(async () => {
    if (authToken === undefined) {
      setLoading(false);
      return;
    }
    if (!authToken) {
      setLoading(false);
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/restoran`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil data restoran: ${response.status}`);
      }

      const result = await response.json();
      let fetchedRestaurants: Restaurant[] = [];
      
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key) && 
            !isNaN(Number(key)) && 
            typeof result[key] === 'object' && 
            result[key] !== null && 
            'id' in result[key]) {
          const restoData = result[key];
          
          console.log(`Restaurant ID: ${restoData.id}, Name: ${restoData.nama}, Foto URL: ${restoData.foto_utama?.url}`);
          
          fetchedRestaurants.push({
            id: restoData.id,
            nama: restoData.nama,
            deskripsi: restoData.deskripsi,
            lokasi: restoData.lokasi,
            foto: restoData.foto_utama?.url || '',
            is_recommended: restoData.is_recommended,
          });
        }
      }

      if (fetchedRestaurants.length === 0) {
        console.warn("API returned no data or data is not in expected numerical keyed format.");
      }

      setRestaurants(fetchedRestaurants);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui saat mengambil data.');
    } finally {
      setLoading(false);
    }
  }, [authToken, handleAuthError]);

  useEffect(() => {
    if (authToken !== undefined) {
      fetchRestaurants();
    }
  }, [fetchRestaurants, authToken]);

  // Handle Recommendation Change
  const handleRecommendChange = async (restoId: string, currentIsRecommended: 0 | 1) => {
    if (!authToken) {
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setUpdatingId(restoId);
    setError(null);

    const newIsRecommended = currentIsRecommended === 1 ? 0 : 1;

    // Optimistic update
    setRestaurants(prevRestaurants =>
      prevRestaurants.map(resto =>
        resto.id === restoId ? { ...resto, is_recommended: newIsRecommended } : resto
      )
    );

    try {
      const response = await fetch(`${API_BASE_URL}/restoran/rekomendasi/${restoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_recommended: newIsRecommended }),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        // Rollback changes if API fails
        setRestaurants(prevRestaurants =>
          prevRestaurants.map(resto =>
            resto.id === restoId ? { ...resto, is_recommended: currentIsRecommended } : resto
          )
        );
        throw new Error(errorData.message || `Gagal memperbarui rekomendasi: ${response.status}`);
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui rekomendasi.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const totalRestaurants = restaurants.length;
  const recommendedCount = restaurants.filter(r => r.is_recommended === 1).length;

  // Loading State
  if (authToken === undefined || (loading && restaurants.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CgSpinner className="animate-spin text-6xl text-blue-600" />
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Memuat Data Restoran</h3>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  // Auth Error State
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Akses Terbatas</h3>
          <p className="text-gray-600 mb-6">Anda belum login atau sesi telah berakhir.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  // API Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-orange-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Terjadi Kesalahan</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12v1a8.003 8.003 0 0015.356-2.012l-1.92-1.92z" />
            </svg>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md w-full border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Belum Ada Data Restoran</h3>
          <p className="text-gray-500 leading-relaxed">Silakan tambahkan restoran baru untuk ditampilkan di sini.</p>
        </div>
      </div>
    );
  }

  // Main Table View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">

            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Restoran</p>
                <p className="text-2xl font-bold text-gray-900">{totalRestaurants}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Direkomendasikan</p>
                <p className="text-2xl font-bold text-gray-900">{recommendedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Restoran</h2>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Restoran
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Foto
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {restaurants.map((resto) => (
                  <tr
                    key={resto.id}
                    className={`transition-all duration-200 hover:bg-slate-50 ${
                      resto.is_recommended === 1 ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    {/* Restaurant Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${
                            resto.is_recommended === 1 ? 'bg-emerald-500 shadow-lg' : 'bg-gray-300'
                          } transition-colors duration-200`}></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {resto.nama}
                          </p>
                          {resto.is_recommended === 1 && (
                            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Aktif
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3" title={resto.deskripsi}>
                        {truncateText(resto.deskripsi, 120)}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 line-clamp-2" title={resto.lokasi}>
                          {resto.lokasi}
                        </span>
                      </div>
                    </td>

                    {/* Image */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div
                          className="relative w-20 h-16 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group hover:border-blue-300 transition-all duration-200"
                          onClick={() => resto.foto && openModal(resto.foto)}
                        >
                          <img
                            src={resto.foto || '/placeholder.jpg'}
                            alt={resto.nama}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/placeholder.jpg';
                              console.error(`Failed to load image for ${resto.nama}: ${resto.foto}`);
                            }}
                          />
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200">
                            <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={resto.is_recommended === 1}
                            onChange={() => handleRecommendChange(resto.id, resto.is_recommended)}
                            disabled={updatingId !== null && updatingId !== resto.id}
                          />
                          <div className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            resto.is_recommended === 1
                              ? 'border-emerald-500 bg-emerald-500 shadow-md'
                              : 'border-gray-300 bg-white hover:border-emerald-400'
                          } ${updatingId === resto.id ? 'animate-pulse' : ''}`}>
                            {updatingId === resto.id ? (
                              <CgSpinner className="animate-spin text-white text-sm" />
                            ) : resto.is_recommended === 1 ? (
                              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default RestaurantTable;