// app/profile/pesanan/page.tsx

'use client'; // Tambahkan "use client" di sini

import { useState } from "react"; // Import useState
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar"; // Import Navbar
import Footer from "@/Components/Footer"; // Import Footer

export default function PesananPage() {
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
          <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>
          <div className="bg-white rounded shadow p-4 flex gap-4">
            <img src="/images/warung.jpg" alt="Warung" className="w-40 rounded object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg">Warung Sambal Bakar Semarang</h2>
                <span className="text-xs font-bold">ID RESERVASI: 100##</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">5 April 2025</p>
              <p className="text-sm text-gray-700">2 Orang, 10:00 – 10:30 WIB</p>
              <p className="text-sm mt-2 text-red-500">
                Jumlah yang belum dibayarkan: Rp.80.000 – <span className="underline cursor-pointer">Lihat Nota</span>
              </p>
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
                className="bg-gray-200 text-[#481111] font-bold px-4 py-2 rounded"
              >
                Ya
              </button>
              <button
                onClick={closeLogoutModal} // Menutup modal jika Tidak diklik
                className="bg-[#481111] text-white font-bold px-4 py-2 rounded"
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
