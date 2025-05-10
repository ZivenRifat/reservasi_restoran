'use client';

import { useState } from 'react'; // Import useState
import Image from 'next/image'; // Untuk menampilkan logo profil
import Link from 'next/link';

const Navbar = () => {
  // State untuk melacak status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fungsi untuk mensimulasikan login
  const handleLogin = () => {
    setIsLoggedIn(true);  // Ganti dengan logika autentikasi nyata
  };

  return (
    <nav className="bg-[#481111] text-[#FFFCEF] px-8 py-4 pr-15 flex justify-between items-center">
      <div className="text-2xl font-bold px-8">
        <Link href="/">LOGO</Link>
        </div>
      <div className="ml-auto flex gap-10 text-[16px] mr-10"> 
        <Link href="/terdekat">Terdekat</Link>
        <Link href="/rekomendasi">Rekomendasi</Link>
        <Link href="/mitra">Mitra</Link>
      </div>

      {/* Kondisi untuk login: Jika sudah login, tampilkan logo profil, jika belum tampilkan tombol Masuk */}
      {isLoggedIn ? (
        <div className="relative">
          {/* Logo Profil yang muncul setelah login */}
          <Image
            src="/images/profile.png" // Ganti dengan path logo profil Anda
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
          />
        </div>
      ) : (
        <Link href="/login">
          <button 
            onClick={handleLogin} // Simulasi login
            className="hover:bg-[#e1ded2] bg-[#FFFCEF] text-[#460D0D] font-semibold rounded-full px-5 py-2 cursor-pointer"
          >
            Masuk
          </button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
