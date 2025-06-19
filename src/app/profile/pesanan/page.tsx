"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Pesanan {
  id_reservasi: string;
  foto_restoran: string;
  nama_restoran: string;
  tanggal: string;
  jumlah_orang: number;
  total_harga: string;
}

export default function PesananPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchPesanan = async () => {
      const token = Cookies.get("auth_token");

      if (!token) {
        setError("Token tidak tersedia.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/pemesan/reservasi/pesanan-saya", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data pesanan.");
        }

        const data = await res.json();
        setPesanan(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <ProfileSidebar openLogoutModal={openLogoutModal} />

        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>

          {loading ? (
            <p>Memuat data pesanan...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : pesanan.length === 0 ? (
            <p className="text-gray-600">Belum ada pesanan.</p>
          ) : (
            pesanan.map((item) => (
              <div
                key={item.id_reservasi}
                className="bg-white rounded shadow p-4 flex gap-4 mb-4"
              >
                <img
                  src={`http://127.0.0.1:8000/foto/${item.foto_restoran}`}
                  alt="Restoran"
                  className="w-40 h-32 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-lg">{item.nama_restoran}</h2>
                    <span className="text-xs font-bold">
                      ID RESERVASI: {item.id_reservasi}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{item.tanggal}</p>
                  <p className="text-sm text-gray-700">
                    {item.jumlah_orang} Orang
                  </p>
                  <p className="text-sm mt-2 text-red-500">
                    Jumlah yang belum dibayarkan: {item.total_harga} –{" "}
                    <span className="underline cursor-pointer">Lihat Nota</span>
                  </p>
                </div>
              </div>
            ))
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
