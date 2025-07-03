"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import SearchBar from "@/Components/SearchBar";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLandingPage = pathname === "/";

  const handleTerdekatClick = () => router.push("/pelanggan/terdekat");
  const handleRekomendasiClick = () => router.push("/pelanggan/rekomendasi");

  return (
    <nav className="bg-[#481111] text-[#FFFCEF] px-16 py-4 flex items-center justify-between">
      {/* Kiri: Logo */}
      <div className="text-2xl font-bold">
        <Link href="/">LOGO</Link>
      </div>

      {/* Tengah: SearchBar (hanya muncul jika bukan landing page) */}
      {!isLandingPage && (
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      )}

      {/* Kanan: Menu dan Login/Profile */}
      <div className="flex items-center gap-6 ml-4">
        <button onClick={handleTerdekatClick} className="hover:underline">
          Terdekat
        </button>
        <button onClick={handleRekomendasiClick} className="hover:underline">
          Rekomendasi
        </button>
        <Link href="/pelanggan/mitra" className="hover:underline">
          Mitra
        </Link>

        {isLoggedIn ? (
          <Link href="/pelanggan/profile">
            <Image
              src="/images/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
            />
          </Link>
        ) : (
          <Link href="/login">
            <button className="hover:bg-[#e1ded2] bg-[#FFFCEF] text-[#460D0D] font-semibold rounded-full px-5 py-2">
              Masuk
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
