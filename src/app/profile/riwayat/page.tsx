// app/profile/riwayat/page.tsx
'use client'; // Tambahkan "use client" di sini

import { useState } from "react";
import ProfileSidebar from '@/Components/ProfileSidebar';
import Navbar from "@/Components/Navbar"; // Import Navbar
import Footer from "@/Components/Footer"; // Import Footer

export default function RiwayatPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk mengontrol modal logout

  // Fungsi untuk membuka modal logout
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Fungsi untuk menutup modal logout
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar /> {/* Menambahkan Navbar */}
      
      <div className="flex flex-1">
        <ProfileSidebar openLogoutModal={openLogoutModal} /> {/* Kirimkan fungsi openLogoutModal ke Sidebar */}
        
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header bagian ID dan Harga */}
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-4">
              <span>ID RESERVASI: 099##</span>
              <span>Rp. 150.000</span>
            </div>

            {/* Konten pesanan */}
            <div className="flex gap-6">
              <img
                src="/images/padang.jpg"
                alt="Padang"
                className="w-40 h-40 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="font-bold text-xl">Rumah Makan Padang</h2>
                <p className="text-sm text-gray-700 mt-2">24 Januari 2025</p>
                <p className="text-sm text-gray-700">4 Orang, 20:00 – 22:00 WIB</p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-full">
                    Reservasi Berhasil
                  </span>
                  <span className="text-green-600 underline text-sm cursor-pointer">
                    Lihat Detail
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer /> {/* Menambahkan Footer */}

      {/* Modal Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center max-w-md">
            <h2 className="font-bold text-lg mb-2">Keluar dari akun</h2>
            <p className="mb-6">Anda yakin ingin keluar dari akun?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  // Tambahkan logika logout di sini
                  setIsLogoutModalOpen(false); // Tutup modal setelah logout
                  console.log("User logged out");
                }}
                className="bg-gray-200 text-[#4A0D0D] font-bold px-4 py-2 rounded"
              >
                Ya
              </button>
              <button
                onClick={closeLogoutModal} // Menutup modal jika Tidak diklik
                className="bg-[#4A0D0D] text-white font-bold px-4 py-2 rounded"
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
