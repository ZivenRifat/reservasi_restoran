'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProfileSidebarProps = {
  openLogoutModal: () => void;
};

// REVISI 1: Kembalikan path ke struktur bersarang (nested) sesuai kode Anda
const menuItems = [
  { name: "Profile Saya", href: "/pelanggan/profile" },
  { name: "Pesanan Saya", href: "/pelanggan/profile/pesanan" },
  { name: "Riwayat Pesanan", href: "/pelanggan/profile/riwayat" },
  { name: "Keluar", href: "#" }, 
];

export default function ProfileSidebar({ openLogoutModal }: ProfileSidebarProps) {
  const pathname = usePathname();

  return (
    // Ukuran sidebar disesuaikan agar tidak terlalu lebar
    <aside className="w-64 flex-shrink-0 flex flex-col gap-2 p-6 bg-white shadow-md rounded-lg">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={item.name === "Keluar" ? (e) => { e.preventDefault(); openLogoutModal(); } : undefined}
          // REVISI 2: Ganti 'startsWith' menjadi perbandingan sama persis '==='
          className={`font-semibold transition-all duration-150 py-2 px-4 rounded-md text-left ${
            pathname === item.href 
              ? "text-white bg-[#481111]" // Gaya aktif
              : "text-gray-700 hover:bg-gray-200 hover:text-[#481111]" // Gaya tidak aktif
          }`}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}