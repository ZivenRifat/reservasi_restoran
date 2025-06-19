'use client';

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Ganti dari useRouter

type ProfileSidebarProps = {
  openLogoutModal: () => void; // Definisikan tipe props
};

const menuItems = [
  { name: "Profile Saya", href: "/profile" },
  { name: "Pesanan Saya", href: "/profile/pesanan" },
  { name: "Riwayat Pesanan", href: "/profile/riwayat" },
  { name: "Keluar", href: "#" }, // Tidak mengarah ke halaman logout, hanya untuk menampilkan modal
];

export default function ProfileSidebar({ openLogoutModal }: ProfileSidebarProps) {
  const pathname = usePathname(); // ✅ untuk cek path saat ini

  return (
    <aside className="w-48 flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={item.name === "Keluar" ? openLogoutModal : undefined} // Menambahkan event handler untuk tombol keluar
          className={`font-semibold transition-all duration-150 py-2 px-4 rounded-md ${
            pathname === item.href
              ? "text-white bg-[#481111] border-l-4 border-[#481111]"
              : "text-gray-700 hover:bg-gray-200 hover:text-[#481111]"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}
