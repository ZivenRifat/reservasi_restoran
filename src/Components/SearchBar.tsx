"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!search) return;
    router.push(`/pelanggan/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <input
        type="text"
        placeholder="Cari restoran..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="bg-white w-full md:w-150 px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-[#676767] transition-all"
      />
      <button
        onClick={handleSearch}
        className="bg-[#FFFCEF] text-[#460D0D] font-semibold px-4 py-2 rounded-full hover:bg-gray-200"
      >
        Cari
      </button>
    </div>
  );
};

export default SearchBar;
