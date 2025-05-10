'use client';

import { useState } from "react";
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar"; // Import Navbar
import Footer from "@/Components/Footer"; // Import Footer

export default function ProfilePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk mengontrol tampilan modal logout

  // Fungsi untuk membuka modal
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  // Fungsi untuk logout (misalnya menghapus session atau token, dll)
  const logout = () => {
    // Implementasikan logika logout di sini
    // Misalnya menghapus session storage atau cookies
    setIsLogoutModalOpen(false); // Tutup modal setelah logout
    // Navigasi ke halaman login atau yang lain jika diperlukan
    console.log("User logged out"); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar /> {/* Tambahkan Navbar di atas */}
      
      <div className="flex flex-1">
        <ProfileSidebar openLogoutModal={openLogoutModal} /> {/* Kirimkan fungsi ke Sidebar */}
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Profile Saya</h1>
          <p className="text-gray-600 mb-6">ziven.ziven@gmail.com</p>
          <form className="space-y-4 max-w-xl">
            {["Nama", "Email", "No. HP", "Password", "Password Baru"].map((label) => (
              <div key={label}>
                <label className="block mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full bg-gray-300 p-2 rounded"
                  disabled
                />
              </div>
            ))}
            <div className="flex justify-end">
              <button className="bg-[#4A0D0D] text-white px-6 py-2 rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer /> 

      {/* Modal Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center max-w-md">
            <h2 className="font-bold text-lg mb-2">Keluar dari akun</h2>
            <p className="mb-6">Anda yakin ingin keluar dari akun?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={logout} // Logout langsung jika Ya diklik
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
