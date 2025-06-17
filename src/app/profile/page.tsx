"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import ProfileSidebar from "@/Components/ProfileSidebar";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

interface UserProfile {
  nama: string;
  email: string;
  no_hp: string;
}

export default function ProfilePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    router.replace("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("auth_token");

      if (!token) {
        console.warn("Token tidak tersedia.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/pemesan/profil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data profil");
        }

        const data = await res.json();
        console.log("Profil berhasil diambil:", data);
        setProfile(data.data); // ✅ Perbaikan di sini
      } catch (err) {
        console.error("Gagal fetch profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <ProfileSidebar openLogoutModal={openLogoutModal} />

        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Profile Saya</h1>

          {loading ? (
            <p>Memuat data profil...</p>
          ) : profile ? (
            <>
              <p className="text-gray-600 mb-6">{profile.email}</p>
              <form className="space-y-4 max-w-xl">
                <div>
                  <label className="block mb-1">Nama</label>
                  <input
                    type="text"
                    className="w-full bg-gray-300 p-2 rounded"
                    value={profile.nama}
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-300 p-2 rounded"
                    value={profile.email}
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1">No. HP</label>
                  <input
                    type="text"
                    className="w-full bg-gray-300 p-2 rounded"
                    value={profile.no_hp}
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full bg-gray-300 p-2 rounded"
                    placeholder="********"
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1">Password Baru</label>
                  <input
                    type="password"
                    className="w-full bg-gray-300 p-2 rounded"
                    placeholder="********"
                    disabled
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-[#4A0D0D] text-white px-6 py-2 rounded"
                    disabled
                  >
                    Submit
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p className="text-red-500">Gagal memuat data profil.</p>
          )}
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
