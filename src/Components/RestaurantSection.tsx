"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import RestaurantCard from "./RestaurantCard";
import { API_URL } from "@/constant";

interface Foto {
  id: string;
  nama_file: string;
  url: string;
}

interface Restaurant {
  id: string;
  nama: string;
  deskripsi: string;
  foto_utama: Foto;
  foto: Foto[];
}

interface LandingResponse {
  recommended: Restaurant[];
  newest: Restaurant[];
  nearest: Restaurant[];
}

const sections = [
  { title: "Rekomendasi Restoran", key: "recommended" },
  { title: "Restoran Terdekat", key: "nearest" },
  { title: "Restoran Baru", key: "newest" },
];

const ITEMS_PER_PAGE = 6;

const RestaurantSection: React.FC = () => {
  const [data, setData] = useState<LandingResponse>({
    recommended: [],
    newest: [],
    nearest: [],
  });

  const [loading, setLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>({
    recommended: 0,
    newest: 0,
    nearest: 0,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_URL}/api/landing`);
        const json = await res.json();
        setData({
          recommended: json.data?.recommended ?? [],
          newest: json.data?.newest ?? [],
          nearest: json.data?.nearest ?? [],
        });
      } catch (error) {
        console.error("Gagal fetch data landing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleNext = (key: string, maxPage: number) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [key]: Math.min(prev[key] + 1, maxPage),
    }));
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 py-10 space-y-12">
      {sections.map((section) => {
        const restaurants = data[section.key as keyof LandingResponse] ?? [];
        const pageIndex = currentIndexes[section.key];
        const maxPage = Math.ceil(restaurants.length / ITEMS_PER_PAGE) - 1;

        const visibleRestaurants = restaurants.slice(
          pageIndex * ITEMS_PER_PAGE,
          pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );

        return (
          <div key={section.key}>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle title={section.title} />
              {pageIndex < maxPage && (
                <button
                  onClick={() => handleNext(section.key, maxPage)}
                  className="px-3 py-1 rounded-full bg-white text-black shadow hover:bg-gray-100"
                >
                  →
                </button>
              )}
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : visibleRestaurants.length === 0 ? (
              <p>Tidak ada restoran untuk kategori ini.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {visibleRestaurants.map((resto) => (
                  <RestaurantCard
                    key={resto.id}
                    href={`/pelanggan/restoran/${resto.id}`}
                    title={resto.nama}
                    description={resto.deskripsi}
                    imageUrl={resto.foto_utama?.url || ""}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RestaurantSection;
