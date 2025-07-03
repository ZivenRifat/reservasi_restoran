// FILE: src/app/admin/ulasan/page.tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from 'cookies-next'; // Import getCookie dan deleteCookie
import { useRouter } from 'next/navigation'; // Import useRouter

// Interface untuk data ulasan dari API
interface UlasanDariApi {
  id: string;
  pengguna: string;
  komentar: string;
  rating: number;
  tanggal: string;
}

// Interface untuk keseluruhan respons data ulasan dari API
interface UlasanApiResponse {
  status: string;
  data?: {
    restoran: string;
    jumlah_ulasan: number;
    rata_rata_rating: number;
    ulasan: UlasanDariApi[];
  };
  message?: string;
}

// Interface untuk error response
interface ErrorResponse {
  message?: string;
}

const UlasanPage = () => {
  const [ulasanList, setUlasanList] = useState<UlasanDariApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk token otentikasi
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Ambil base URL dari variabel lingkungan
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Handler untuk otentikasi gagal (dari fetch, atau dipanggil secara eksternal)
  const handleAuthError = useCallback(() => {
    setError('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
    // Hapus cookie token yang mungkin sudah kadaluarsa/invalid.
    // Pastikan ini adalah nama cookie yang benar untuk token pemilik restoran.
    deleteCookie('auth_token');
    router.push('/login'); // Arahkan ke halaman login pemilik restoran
  }, [router]);

  // Effect untuk mengambil token dari cookie saat komponen dimuat
  useEffect(() => {
    const retrieveToken = async () => {
      // Asumsi nama cookie untuk pemilik restoran adalah 'owner_auth_token'
      const storedToken = await getCookie('auth_token');
      if (typeof storedToken === 'string') {
        setAuthToken(storedToken);
      } else {
        console.log('No owner authentication token found. Redirecting to owner login.');
        setAuthToken(undefined);
        // Langsung panggil handleAuthError untuk menampilkan pesan dan redirect
        handleAuthError();
      }
    };
    retrieveToken();
  }, [handleAuthError]); // handleAuthError sebagai dependency karena useCallback

  // Fungsi untuk mengambil data ulasan dari API
  const fetchUlasan = useCallback(async () => {
    // Cek authToken sebelum fetch
    if (authToken === undefined) { // Masih menunggu token dari cookie
      setLoading(true); // Tetap di loading state
      return;
    }
    if (!authToken) { // Token tidak ditemukan atau tidak valid
      setLoading(false);
      setError('Anda belum login sebagai pemilik restoran atau sesi telah berakhir.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gunakan API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/penyedia/restoran/ulasan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // <<< Tambahkan ini: kirim token otentikasi
        },
        // credentials: 'include', // Ini mungkin tidak lagi diperlukan jika menggunakan Bearer Token
                                 // atau bisa tetap dipertahankan jika backend juga menggunakan session/cookie
      });

      if (response.status === 401) { // Tangani 401 Unauthorized
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP error! Status: ${response.status}`;

        if (contentType?.includes("application/json")) {
          try {
            const errorData: ErrorResponse = await response.json();
            errorMessage += `, Message: ${errorData.message || response.statusText}`;
          } catch (parseError) {
            errorMessage += `, Message: ${response.statusText}`;
          }
        } else {
          try {
            const errorText = await response.text();
            errorMessage += `, Raw Response: ${errorText.substring(0, 100)}${errorText.length > 100 ? '...' : ''}`;
          } catch (textError) {
            errorMessage += `, Message: ${response.statusText}`;
          }
        }

        throw new Error(errorMessage);
      }

      const result: UlasanApiResponse = await response.json();

      if (result.status === 'success') {
        if (result.data?.ulasan) {
          setUlasanList(result.data.ulasan);
        } else {
          // Kasus ketika status success tapi 'ulasan' array kosong atau null
          setUlasanList([]); // Pastikan array ulasan dikosongkan
          console.warn('Data ulasan kosong meskipun status sukses.');
        }
      } else {
        throw new Error(result.message || 'Gagal mengambil data ulasan.');
      }
    } catch (error) {
      console.error("Fetch Ulasan Error:", error);

      let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';

      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          errorMessage = "Gagal terhubung ke server API. Pastikan server backend berjalan dan CORS dikonfigurasi dengan benar.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, authToken, handleAuthError]); // Tambahkan authToken ke dependency array

  // Efek untuk memuat data saat komponen di-mount atau authToken berubah
  useEffect(() => {
    // Pastikan fetchUlasan dipanggil hanya setelah authToken diset (bukan undefined awal)
    if (authToken !== undefined) {
      fetchUlasan();
    }
  }, [fetchUlasan, authToken]); // Tambahkan authToken sebagai dependency

  // Render kondisional untuk loading sesi awal (saat ambil token)
  if (authToken === undefined) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-10 text-gray-700">
          <div className="animate-pulse">Memuat sesi...</div>
        </div>
      </div>
    );
  }

  // Render kondisional jika token tidak ada setelah proses pengambilan
  if (!authToken) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-10">
          <div className="text-red-600 mb-4">Error: Anda tidak memiliki akses atau sesi telah berakhir.</div>
          <button
            onClick={() => router.push('/owner/login')} // Sesuaikan dengan path login pemilik
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Login Sebagai Pemilik Restoran
          </button>
        </div>
      </div>
    );
  }

  // Render kondisional untuk loading data setelah token tersedia
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-10 text-gray-700">
          <div className="animate-pulse">Memuat ulasan...</div>
        </div>
      </div>
    );
  }

  // Render kondisional untuk error dari fetch API
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-10">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchUlasan}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ulasan Pelanggan</h1>
        <button
          onClick={fetchUlasan}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      {ulasanList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Tidak ada ulasan ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ulasanList.map((ulasan) => (
            <div
              key={ulasan.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{ulasan.pengguna}</p>
                  <p className="text-sm text-gray-500">{ulasan.tanggal}</p>
                  {ulasan.rating > 0 && (
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600 mr-2">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">{ulasan.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{ulasan.komentar}</p>

              {/* Section untuk balasan pemilik - hanya menampilkan jika ada, tanpa form atau tombol aksi */}
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UlasanPage;