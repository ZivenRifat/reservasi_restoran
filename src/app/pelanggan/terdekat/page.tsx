'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import RestaurantCard from "@/Components/RestaurantCard";
import { API_URL } from '@/constant';

type Restaurant = {
  id: string;
  nama: string;
  deskripsi: string;
  foto_utama?: {
    url: string;
  };
};

const TerdekatPage = () => {
  const [restoran, setRestoran] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/terdekat?latitude=0&longitude=0`);
        const json = await res.json();
        setRestoran(json.data || []);
      } catch (error) {
        console.error("Gagal fetch restoran terdekat", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 py-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Restoran Terdekat</h1>
        <p className="text-gray-600 mb-6">Pilihan restoran terdekat!</p>

        <div className="space-y-6">
          {restoran.map((item) => (
            <Link
              key={item.id}
              href={`/restoran/${item.id}`}
              className="block"
            >
              <RestaurantCard
                title={item.nama}
                description={item.deskripsi}
                imageUrl={item.foto_utama?.url || "/images/default.jpg"}
                variant="recommendation"
              />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TerdekatPage;
