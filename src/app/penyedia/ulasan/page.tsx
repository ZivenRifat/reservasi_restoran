<<<<<<< HEAD
'use client';

import { useState, useEffect } from "react";
import { MessageCircleReply } from "lucide-react";

// --- Interface untuk data ulasan dari API ---
interface UlasanDariApi {
  id: string; // ID unik ulasan, pastikan tipe ini sesuai dengan API Anda (string/number)
  pengguna: string; // Nama pengguna yang memberikan ulasan
  komentar: string;
  rating: number; // Rating ulasan, jika ada (misal: 1-5)
  tanggal: string; // Tanggal ulasan (format string, misal: "YYYY-MM-DD HH:MM:SS")
  balasan_pemilik?: string; // Balasan dari pemilik restoran (opsional)
}

// --- Interface untuk keseluruhan respons data ulasan dari API ---
interface UlasanApiResponse {
  status: string; // Status respons (misal: "success", "error")
  data?: { // Properti 'data' bisa opsional, terutama jika ada error
    restoran: string;
    jumlah_ulasan: number;
    rata_rata_rating: number;
    ulasan: UlasanDariApi[]; // Array ulasan
  };
  message?: string; // Properti 'message' bisa ada jika ada error atau pesan lainnya
=======
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
>>>>>>> origin/main
}

const UlasanPage = () => {
  const [ulasanList, setUlasanList] = useState<UlasanDariApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  // --- TOKEN AUTENTIKASI DI SINI (HARDCODED) ---
  const token = '5l1oDsKiycT1XIAfZHl95AefT9jRUAyyLLgn7cDP0a7ef34d';
  // ---------------------------------------------

  const [balasanBaru, setBalasanBaru] = useState<{ [id: string]: string }>({});
  const [bukaForm, setBukaForm] = useState<{ [id: string]: boolean }>({});

  // Fungsi untuk mengambil data ulasan dari API
  const fetchUlasan = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/penyedia/restoran/ulasan', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
=======
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
>>>>>>> origin/main
      }

      const result: UlasanApiResponse = await response.json();

      if (result.status === 'success') {
<<<<<<< HEAD
        if (result.data) {
          setUlasanList(result.data.ulasan.map(ulasan => ({
            ...ulasan,
            // Jika nama field dari API berbeda dengan interface Anda, lakukan pemetaan di sini.
            // Contoh: pengguna: ulasan.nama_pengguna_dari_api,
            // id: String(ulasan.id_ulasan_dari_api), // Jika ID di API adalah number tapi Anda ingin string
          })));
        } else {
          throw new Error('Data ulasan tidak ditemukan meskipun status sukses.');
        }
      } else {
        // --- KOREKSI INI: Hapus satu 'new' ---
        throw new Error(result.message || 'Gagal mengambil data ulasan.');
        // ------------------------------------
      }
    } catch (e: any) {
      console.error("Fetch Ulasan Error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk memicu fetching data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchUlasan(token);
  }, [token]);

  // Handler untuk mengirim balasan ke API
  const handleKirimBalasan = async (ulasanId: string, balasan: string) => {
    if (!token) {
      alert('Token autentikasi tidak tersedia. Silakan cek kode Anda.');
      return;
    }
    if (!balasan.trim()) {
      alert('Balasan tidak boleh kosong.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/penyedia/restoran/ulasan/${ulasanId}/balas`, {
        method: 'PUT', // Atau 'PATCH' atau 'POST', tergantung API Anda
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ balasan_pemilik: balasan }), // Sesuaikan nama key yang diharapkan API Anda
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
      }

      setUlasanList((prev) =>
        prev.map((item) =>
          item.id === ulasanId
            ? { ...item, balasan_pemilik: balasan }
            : item
        )
      );
      setBalasanBaru((prev) => ({ ...prev, [ulasanId]: "" }));
      setBukaForm((prev) => ({ ...prev, [ulasanId]: false }));
      alert('Balasan berhasil dikirim!');
    } catch (e: any) {
      console.error('Gagal mengirim balasan:', e);
      alert(`Gagal mengirim balasan: ${e.message}`);
    }
  };

  // --- Render Kondisional ---
  if (loading) {
    return <div className="text-center py-10 text-gray-700">Memuat ulasan...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
=======
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
>>>>>>> origin/main
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
<<<<<<< HEAD
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Ulasan Pelanggan</h1>
      {ulasanList.length === 0 && (
        <p className="text-center text-gray-500">Tidak ada ulasan ditemukan.</p>
      )}

      {ulasanList.map((ulasan) => (
        <div
          key={ulasan.id}
          className="bg-white p-5 rounded-xl shadow border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold text-gray-800">{ulasan.pengguna}</p>
              <p className="text-sm text-gray-500">{ulasan.tanggal}</p>
              {ulasan.rating > 0 && (
                <p className="text-yellow-500 text-sm">
                  Rating: {ulasan.rating} ⭐
                </p>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-3">{ulasan.komentar}</p>

          {ulasan.balasan_pemilik ? (
            <div className="bg-gray-100 p-3 rounded-md border-l-4 border-blue-500 text-sm text-gray-600">
              <strong className="block text-blue-700 mb-1">Balasan Pemilik:</strong>
              {ulasan.balasan_pemilik}
            </div>
          ) : (
            <div>
              {!bukaForm[ulasan.id] ? (
                <button
                  onClick={() =>
                    setBukaForm((prev) => ({ ...prev, [ulasan.id]: true }))
                  }
                  className="flex items-center mt-2 text-sm text-blue-600 hover:underline"
                >
                  <MessageCircleReply className="w-4 h-4 mr-1" />
                  Balas Ulasan
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={2}
                    placeholder="Tulis balasan..."
                    value={balasanBaru[ulasan.id] || ""}
                    onChange={(e) =>
                      setBalasanBaru((prev) => ({
                        ...prev,
                        [ulasan.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleKirimBalasan(ulasan.id, balasanBaru[ulasan.id] || "")}
                      className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Kirim
                    </button>
                    <button
                      onClick={() =>
                        setBukaForm((prev) => ({ ...prev, [ulasan.id]: false }))
                      }
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
=======
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
>>>>>>> origin/main
    </div>
  );
};

export default UlasanPage;