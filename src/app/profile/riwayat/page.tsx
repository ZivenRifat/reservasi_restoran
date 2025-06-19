"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RiwayatPesanan {
  id_reservasi: string;
  foto_restoran: string;
  nama_restoran: string;
  tanggal: string;
  jumlah_orang: number;
  total_harga: string;
  status: string;
}

export default function RiwayatPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.replace("/");
  };

  useEffect(() => {
    const fetchRiwayatPesanan = async () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        console.warn("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/pemesan/reservasi/riwayatpesanan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Gagal mengambil riwayat pesanan");
        }

        const data = await res.json();
        setRiwayat(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayatPesanan();
  }, []);

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
                  key={item.id_reservasi}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-4">
                    <span>ID RESERVASI: {item.id_reservasi}</span>
                    <span>{item.total_harga}</span>
                  </div>

                  <div className="flex gap-6">
                    <img
                      src={`http://127.0.0.1:8000/foto/${item.foto_restoran}`}
                      alt={item.nama_restoran}
                      className="w-40 h-40 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-xl">{item.nama_restoran}</h2>
                      <p className="text-sm text-gray-700 mt-2">{item.tanggal}</p>
                      <p className="text-sm text-gray-700">
                        {item.jumlah_orang} Orang
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <span
                          className={`text-sm px-4 py-1 rounded-full ${
                            item.status === "Reservasi Berhasil"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-400 text-black"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-green-600 underline text-sm cursor-pointer">
                          Lihat Detail
                        </span>
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

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center max-w-md">
            <h2 className="font-bold text-lg mb-2">Keluar dari akun</h2>
            <p className="mb-6">Anda yakin ingin keluar dari akun?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-[#4A0D0D] font-bold px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
              >
                Ya
              </button>
              <button
                onClick={closeLogoutModal}
                className="bg-[#4A0D0D] text-white font-bold px-4 py-2 rounded hover:bg-[#600F0F] cursor-pointer"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
