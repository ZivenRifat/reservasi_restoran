"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // ✅ Gunakan context

const Navbar = () => {
  const { isLoggedIn } = useAuth(); // ✅ Ambil status login
  const router = useRouter();

  const handleTerdekatClick = () => router.push("/terdekat");
  const handleRekomendasiClick = () => router.push("/rekomendasi");

  return (
    <nav className="bg-[#481111] text-[#FFFCEF] px-8 py-4 pr-15 flex justify-between items-center">
      <div className="text-2xl font-bold px-8">
        <Link href="/">LOGO</Link>
      </div>

      <div className="ml-auto flex gap-10 text-[16px] mr-10">
        <button onClick={handleTerdekatClick} className="hover:underline">
          Terdekat
        </button>
        <button onClick={handleRekomendasiClick} className="hover:underline">
          Rekomendasi
        </button>
        <Link href="/mitra">Mitra</Link>
      </div>

      {isLoggedIn ? (
        <Link href="/profile">
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
          <button className="hover:bg-[#e1ded2] bg-[#FFFCEF] text-[#460D0D] font-semibold rounded-full px-5 py-2 cursor-pointer">
            Masuk
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
