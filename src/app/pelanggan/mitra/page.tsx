"use client";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Image from "next/image";
import Link from "next/link"; // ✅ Import Link

const MitraPage = () => {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen flex items-center justify-between px-6 md:px-16 bg-cover bg-center m-0"
        style={{ backgroundImage: "url('/images/Mitra.png')" }}
      >
        <div className="flex-1 text-white">
          <h1 className="text-5xl font-extrabold mb-6">LOGO</h1>

          <Link href="/pelanggan/hubungi-kami">
            <button className="font-semibold bg-[#FFF5E0] text-[#481111] px-8 py-3 rounded-full text-lg shadow hover:brightness-95 transition">
              Hubungi Kami
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MitraPage;
