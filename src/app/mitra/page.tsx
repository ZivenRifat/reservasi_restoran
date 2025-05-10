import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Image from "next/image";

const MitraPage = () => {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen flex items-center justify-between px-6 md:px-16 bg-cover bg-center m-0" // Hapus margin
        style={{ backgroundImage: "url('/images/Mitra.png')" }} // Ganti dengan gambar kamu
      >
        <div className="flex-1 text-white">
          <h1 className="text-5xl font-extrabold mb-6">LOGO</h1>
          <button className="bg-[#FFF5E0] text-black px-8 py-3 rounded-full text-lg shadow hover:brightness-95 transition">
            Hubungi Kami
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MitraPage;
