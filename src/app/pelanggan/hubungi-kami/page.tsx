"use client";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

const HubungiKamiPage = () => {
  return (
    <>
      <Navbar />

      <main className="bg-[#f5f5f5] py-16 px-6 md:px-20 flex flex-col lg:flex-row gap-12 items-center justify-between min-h-screen">
        {/* Kiri */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-snug text-black mb-4">
            Ciptakan Momen Tak <br /> Terlupakan di Setiap Santapan.
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Makan Enak Dimulai dari Reservasi Praktis!
          </p>
        </div>

        {/* Kanan */}
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">Kontak Admin</h2>
          <p className="text-gray-700 mb-6">
            Hubungi untuk bermitra bersama kami!
          </p>

          <ol className="space-y-6 relative border-l-2 border-dotted border-[#5b1b1b] pl-6">
            <li className="flex items-center gap-4">
              <div className="bg-[#5b1b1b] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-black font-semibold">Hubungi admin</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-[#5b1b1b] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-black font-semibold">
                Isi persyaratan bermitra
              </span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-[#5b1b1b] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-black font-semibold">
                Pendaftaran selesai!
              </span>
            </li>
          </ol>

          <div className="flex justify-start gap-6 mt-8 text-2xl text-black">
            <Link href="#">
              <FaInstagram className="hover:text-[#5b1b1b]" />
            </Link>
            <Link href="#">
              <FaWhatsapp className="hover:text-[#5b1b1b]" />
            </Link>
            <Link href="#">
              <FaFacebook className="hover:text-[#5b1b1b]" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HubungiKamiPage;
