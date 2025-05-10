'use client';

import { useState } from 'react'; // Import useState

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center h-[658px] flex flex-col items-start justify-center text-white"
      style={{ backgroundImage: "url('/images/SearchbarPic.jpg')" }}
    >
      {/* Overlay to darken the background for text readability */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* Content inside the Hero section */}
      <div className="relative w-full max-w-4xl text-left px-6 md:px-16 space-y-2 z-20 text-[#FFFCEF]">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Cari restoran favorit kamu.
        </h1>

        {/* Sub Heading */}
        <p className="text-2xl md:text-2xl font-semibold">
          Sederhana dan Cepat, Pesan Meja dengan Mudah
          <br />
          Buat rencana reservasi mu disini !
        </p>
      </div>

      {/* Centered search bar */}
      <div className="w-full flex justify-center mt-20 z-20 pb-30 text-lg">
        <input
          type="text"
          placeholder="Cari restoran..."
          className="bg-white w-4/5 sm:w-4/5 md:w-3/4 lg:max-w-5xl px-8 py-5 rounded-full text-black focus:outline-none focus:ring-3 focus:ring-[#676767] transition-all duration-300 ease-in-out"
        />
      </div>
    </section>
  );
};

export default Hero;
