'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!search) return;
    // Redirect ke halaman search dengan query parameter
    router.push(`/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <section
      className="relative bg-cover bg-center h-[658px] flex flex-col items-start justify-center text-white"
      style={{ backgroundImage: "url('/images/SearchbarPic.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <div className="relative w-full max-w-4xl text-left px-6 md:px-16 space-y-2 z-20 text-[#FFFCEF]">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Cari restoran favorit kamu.
        </h1>
        <p className="text-2xl font-semibold">
          Sederhana dan Cepat, Pesan Meja dengan Mudah
          <br />
          Buat rencana reservasi mu disini!
        </p>
      </div>

      <div className="w-full flex justify-center mt-20 z-20 pb-30 text-lg gap-4">
        <input
          type="text"
          placeholder="Cari restoran..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="bg-white w-4/5 sm:w-4/5 md:w-3/4 lg:max-w-5xl px-8 py-5 rounded-full text-black focus:outline-none focus:ring-3 focus:ring-[#676767] transition-all duration-300 ease-in-out"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 rounded-full bg-[#FFFCEF] text-[#460D0D] font-semibold hover:bg-gray-200"
        >
          Cari
        </button>
      </div>
    </section>
  );
};

export default Hero;
