'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ImageModal from './ImageModal';
import { CgSpinner } from 'react-icons/cg';

// Interface untuk struktur data restoran
interface Restaurant {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  foto: string;
  is_recommended: 0 | 1;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';
const IMAGE_BASE_URL = 'http://127.0.0.1:8000/';
const AUTH_TOKEN = 'YCXYVZHkCUCc9xNZsOU19q5FqxfQ8oKA3bHLhAoR1e10ab98';

const RestaurantTable: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedRecommendedId, setSelectedRecommendedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const openModal = (imagePath: string) => {
    setSelectedImage(IMAGE_BASE_URL + imagePath);
    setModalOpen(true);
  };

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/restoran`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Sesi telah berakhir. Silakan login kembali.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil data restoran: ${response.status}`);
      }

      const result = await response.json();

      // --- BAGIAN PERBAIKAN UTAMA DI SINI ---
      // Akses properti 'data' kedua dari respons API untuk mendapatkan array restoran
      const fetchedRestaurants: Restaurant[] = Array.isArray(result.data?.data) ? result.data.data : [];

      if (fetchedRestaurants.length === 0 && (!result.data || !result.data.data)) {
          console.warn("API returned no data or 'data.data' property is missing/empty.");
          // Anda bisa mengatur error di sini jika respons kosong dianggap sebagai error
          // setError("Tidak ada data restoran yang ditemukan.");
      }

      let currentRecommended: string | null = null;
      const formattedRestaurants = fetchedRestaurants.map(resto => {
        if (resto.is_recommended === 1) {
          currentRecommended = resto.id;
        }
        return resto;
      });

      setRestaurants(formattedRestaurants);
      setSelectedRecommendedId(currentRecommended);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui saat mengambil data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleRecommendChange = async (selectedId: string) => {
    if (selectedId === selectedRecommendedId) {
      return;
    }

    setUpdatingId(selectedId);
    setError(null);

    let oldRecommendedId: string | null = selectedRecommendedId;

    try {
      if (oldRecommendedId) {
        setRestaurants(prevRestaurants =>
          prevRestaurants.map(resto =>
            resto.id === oldRecommendedId ? { ...resto, is_recommended: 0 } : resto
          )
        );
        const responseOld = await fetch(`${API_BASE_URL}/restoran/rekomendasi/${oldRecommendedId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_recommended: 0 }),
        });
        if (!responseOld.ok) {
          const errorData = await responseOld.json();
          setRestaurants(prevRestaurants =>
            prevRestaurants.map(resto =>
              resto.id === oldRecommendedId ? { ...resto, is_recommended: 1 } : resto
            )
          );
          throw new Error(errorData.message || `Gagal membatalkan rekomendasi lama: ${responseOld.status}`);
        }
      }

      setRestaurants(prevRestaurants =>
        prevRestaurants.map(resto =>
          resto.id === selectedId ? { ...resto, is_recommended: 1 } : resto
        )
      );

      const responseNew = await fetch(`${API_BASE_URL}/restoran/rekomendasi/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_recommended: 1 }),
      });

      if (!responseNew.ok) {
        const errorData = await responseNew.json();
        setRestaurants(prevRestaurants =>
          prevRestaurants.map(resto =>
            resto.id === selectedId ? { ...resto, is_recommended: 0 } : resto
          )
        );
        if (oldRecommendedId) {
            setRestaurants(prevRestaurants =>
                prevRestaurants.map(resto =>
                    resto.id === oldRecommendedId ? { ...resto, is_recommended: 1 } : resto
                )
            );
        }
        throw new Error(errorData.message || `Gagal merekomendasikan restoran baru: ${responseNew.status}`);
      }

      setSelectedRecommendedId(selectedId);
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui rekomendasi.');
      fetchRestaurants();
    } finally {
      setUpdatingId(null);
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Loading state
  if (loading && restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner className="animate-spin text-6xl text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-medium">Memuat data restoran...</p>
          <p className="text-sm text-gray-500 mt-2">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border-l-4 border-red-500">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Terjadi Kesalahan!</h3>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12v1a8.003 8.003 0 0115.356-2.012l-1.92-1.92z" />
            </svg>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-12 max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Data Restoran</h3>
          <p className="text-gray-500">Silakan tambahkan restoran baru untuk ditampilkan di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Restoran</h2>
            <p className="text-sm text-gray-600 mt-1">Pilih restoran yang ingin direkomendasikan kepada pengunjung</p>
          </div>

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
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rekomendasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((resto, index) => (
                  <tr
                    key={resto.id}
                    className={`group ${
                      resto.is_recommended === 1
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : index % 2 === 0
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-25 hover:bg-gray-50'
                    } transition-all duration-200 ease-in-out`}
                  >
                    {/* Nama Restoran */}
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${
                            resto.is_recommended === 1 ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {resto.nama}
                          </div>
                          {resto.is_recommended === 1 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                              Direkomendasikan
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Deskripsi */}
                    <td className="px-6 py-6">
                      <div className="text-sm text-gray-700 leading-relaxed max-w-xs">
                        <p title={resto.deskripsi}>
                          {truncateText(resto.deskripsi, 120)}
                        </p>
                      </div>
                    </td>

                    {/* Lokasi */}
                    <td className="px-6 py-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="max-w-xs" title={resto.lokasi}>
                          {truncateText(resto.lokasi, 50)}
                        </span>
                      </div>
                    </td>

                    {/* Gambar */}
                    <td className="px-6 py-6">
                      <div
  className={`relative group ${resto.foto ? 'cursor-pointer' : 'cursor-not-allowed'}`}
  onClick={() => resto.foto && openModal(resto.foto)} // Hanya panggil openModal jika resto.foto ada
>
  <img
    src={resto.foto ? IMAGE_BASE_URL + resto.foto : '/placeholder-image.png'}
    alt={resto.nama}
    className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200 transform group-hover:scale-105"
  />
  {/* Tambahkan overlay atau indikator jika tidak ada gambar */}
  {!resto.foto && (
    <div className="absolute inset-0 bg-gray-400 bg-opacity-50 rounded-lg flex items-center justify-center">
      <span className="text-white text-xs font-semibold">Tidak Ada Gambar</span>
    </div>
  )}
  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
    </svg>
  </div>
</div>
                    </td>

                    {/* Radio Button */}
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            className="sr-only"
                            name="restaurantRecommendation"
                            value={resto.id}
                            checked={resto.is_recommended === 1}
                            onChange={() => handleRecommendChange(resto.id)}
                            disabled={loading || updatingId !== null}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            resto.is_recommended === 1
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 bg-white group-hover:border-blue-400'
                          } ${updatingId === resto.id ? 'animate-pulse' : ''}`}>
                            {updatingId === resto.id ? (
                              <CgSpinner className="animate-spin text-white text-sm" />
                            ) : resto.is_recommended === 1 ? (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            ) : null}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                            {updatingId === resto.id ? 'Memperbarui...' :
                             resto.is_recommended === 1 ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Total {restaurants.length} restoran • {restaurants.filter(r => r.is_recommended === 1).length} direkomendasikan</p>
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default RestaurantTable;