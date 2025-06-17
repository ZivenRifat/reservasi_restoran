"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // import Link
import SectionTitle from "./SectionTitle";
import RestaurantCard from "./RestaurantCard";

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

const RestaurantSection: React.FC = () => {
  const [data, setData] = useState<LandingResponse>({
    recommended: [],
    newest: [],
    nearest: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/landing");
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

  return (
    <div className="px-15 py-8 space-y-12">
      {sections.map((section, idx) => {
        const restaurants = data[section.key as keyof LandingResponse] ?? [];

        return (
          <div key={idx}>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle title={section.title} />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : restaurants.length === 0 ? (
              <p>Tidak ada restoran untuk kategori ini.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {restaurants.map((resto) => (
                    <RestaurantCard
                      href={`/restoran/${resto.id}`}
                      title={resto.nama}
                      description={resto.deskripsi}
                      imageUrl={resto.foto_utama?.url || ""}
                      variant="default" // atau "recommendation"
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
