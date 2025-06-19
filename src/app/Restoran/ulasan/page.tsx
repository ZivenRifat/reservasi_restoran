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
}

const UlasanPage = () => {
  const [ulasanList, setUlasanList] = useState<UlasanDariApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- TOKEN AUTENTIKASI DI SINI (HARDCODED) ---
  const token = 'AmA7kXOEfuiVCO1ZiUj0C5En34u7RxiSODn96EIv19bf6872';
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
      }

      const result: UlasanApiResponse = await response.json();

      if (result.status === 'success') {
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
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
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
    </div>
  );
};

export default UlasanPage;