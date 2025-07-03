"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constant";

// REVISI 1: Tambahkan properti `sudah_diulas`
interface RiwayatPesanan {
  reservasi_id: string;
  id_reservasi: string;
  restoran_id: string;
  foto_restoran: string;
  nama_restoran: string;
  tanggal: string;
  jumlah_orang: number;
  total_harga: string;
  status: string;
  sudah_diulas: boolean; // Menandakan apakah pesanan ini sudah punya ulasan
}

export default function RiwayatPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUlasanModal, setShowUlasanModal] = useState(false);
  const [ulasanReservasiId, setUlasanReservasiId] = useState<string | null>(
    null
  );
  const [ulasanRestoranId, setUlasanRestoranId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [komentar, setKomentar] = useState("");

  const { logout } = useAuth();
  const router = useRouter();

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.replace("/");
  };

  const handleOpenUlasanModal = (reservasi_id: string, restoran_id: string) => {
    if (!reservasi_id || !restoran_id) {
      console.error("Reservasi ID atau Restoran ID tidak ditemukan!");
      alert("Gagal membuka modal ulasan, data tidak lengkap.");
      return;
    }
    setUlasanReservasiId(reservasi_id);
    setUlasanRestoranId(restoran_id);
    setShowUlasanModal(true);
  };

  const handleSubmitUlasan = async () => {
    if (rating < 1 || rating > 5) {
      alert("Silakan pilih rating antara 1 sampai 5 bintang.");
      return;
    }
    if (komentar.trim() === "") {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    const token = Cookies.get("auth_token");
    if (!token || !ulasanReservasiId || !ulasanRestoranId) {
      alert("Data ulasan belum lengkap. Gagal mengirim.");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/pemesan/reservasi/lihat-nota/ulasan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // REVISI 2: Ubah 'rating' menjadi string saat mengirim data
          body: JSON.stringify({
            reservasi_id: ulasanReservasiId,
            restoran_id: ulasanRestoranId,
            rating: String(rating), // Kirim sebagai string
            komentar,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.status === "success") {
        alert("Ulasan berhasil dikirim!");
        setShowUlasanModal(false);
        setKomentar("");
        setRating(0);

        // REVISI 3: Muat ulang data riwayat untuk update status tombol ulasan
        fetchRiwayatPesanan();
      } else {
        alert(
          "Gagal mengirim ulasan: " + (data.message || "Terjadi kesalahan")
        );
      }
    } catch (err) {
      console.error("Gagal kirim ulasan:", err);
      alert("Terjadi kesalahan saat mengirim ulasan.");
    }
  };

  const fetchRiwayatPesanan = async () => {
    const token = Cookies.get("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/pemesan/reservasi/riwayatpesanan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Gagal mengambil riwayat pesanan");

      const data = await res.json();
      setRiwayat(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayatPesanan();
  }, []);

  const getStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "dikonfirmasi":
      case "reservasi berhasil":
      case "selesai": // Tambahkan status 'selesai' jika ada
        return "bg-green-500 text-white";
      case "dibatalkan":
        return "bg-red-500 text-white";
      case "menunggu":
      default:
        return "bg-yellow-400 text-black";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <ProfileSidebar openLogoutModal={openLogoutModal} />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan</h1>

          {loading ? (
            <p>Memuat data riwayat...</p>
          ) : riwayat.length > 0 ? (
            <div className="space-y-6">
              {riwayat.map((item) => (
                <div
                  key={item.reservasi_id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-4">
                    <span>ID RESERVASI: {item.id_reservasi}</span>
                    <span>{item.total_harga}</span>
                  </div>
                  <div className="flex gap-6">
                    <img
                      src={`${API_URL}/foto/${item.foto_restoran}`}
                      alt={item.nama_restoran}
                      className="w-40 h-40 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-xl">
                        {item.nama_restoran}
                      </h2>
                      <p className="text-sm text-gray-700 mt-2">
                        {item.tanggal}
                      </p>
                      <p className="text-sm text-gray-700">
                        {item.jumlah_orang} Orang
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span
                          className={`text-sm px-4 py-1 rounded-full ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        {/* REVISI 4: Tampilkan tombol/teks berdasarkan status ulasan */}
                        {item.status.toLowerCase() === "dikonfirmasi" ||
                        item.status.toLowerCase() === "selesai" ? (
                          item.sudah_diulas ? (
                            <span className="text-sm text-gray-500">
                              Sudah diulas
                            </span>
                          ) : (
                            <button
                              className="text-blue-600 underline text-sm cursor-pointer"
                              onClick={() => {
                                handleOpenUlasanModal(
                                  item.reservasi_id,
                                  item.restoran_id
                                );
                              }}
                            >
                              Beri Ulasan
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Belum ada riwayat pesanan.</p>
          )}
        </div>
      </div>
      <Footer />
      {showUlasanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Beri Ulasan</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Rating:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={star <= rating ? "#facc15" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#facc15"
                      className="w-8 h-8 cursor-pointer transition hover:scale-110"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.75.75 0 011.04 0l2.515 2.558 3.417.497a.75.75 0 01.415 1.279l-2.474 2.41.584 3.41a.75.75 0 01-1.088.791L12 13.347l-3.049 1.597a.75.75 0 01-1.088-.79l.584-3.412-2.474-2.411a.75.75 0 01.415-1.28l3.417-.496L11.48 3.5z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Komentar
              </label>
              <textarea
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUlasanModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitUlasan}
                disabled={
                  rating === 0 ||
                  komentar.trim() === "" ||
                  !ulasanReservasiId ||
                  !ulasanRestoranId
                }
                className={`px-4 py-2 rounded text-white ${
                  rating === 0 || komentar.trim() === "" || !ulasanRestoranId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4A0D0D] hover:bg-[#600F0F]"
                }`}
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
      {" "}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {" "}
          <div className="bg-white p-6 rounded-xl text-center max-w-md">
            {" "}
            <h2 className="font-bold text-lg mb-2">Keluar dari akun</h2>
            <p className="mb-6">Anda yakin ingin keluar dari akun?</p>
            {" "}
            <div className="flex justify-center gap-4">
              {" "}
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-[#4A0D0D] font-bold px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
              >
                Ya {" "}
              </button>
              {" "}
              <button
                onClick={closeLogoutModal}
                className="bg-[#4A0D0D] text-white font-bold px-4 py-2 rounded hover:bg-[#600F0F] cursor-pointer"
              >
                Tidak {" "}
              </button>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      )}
    </div>
  );
}
