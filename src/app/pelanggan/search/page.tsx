'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import RestaurantCard from '@/Components/RestaurantCard';
import { API_URL } from '@/constant';

type Restaurant = {
  id: string;
  nama: string;
  deskripsi: string;
  foto_utama: { url: string } | null; // sesuaikan dengan struktur data backend
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [restoran, setRestoran] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/restoran?search=${encodeURIComponent(query)}`);
        const json = await res.json();

        if (json.status === 'success') {
          setRestoran(json.data || []);
        } else {
          setError('Gagal mengambil data');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 py-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Hasil pencarian: "{query}"</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && restoran.length === 0 && <p>Tidak ada restoran yang ditemukan.</p>}

        <div className="space-y-6">
          {restoran.map((item) => (
            <Link key={item.id} href={`/restoran/${item.id}`} className="block">
              <RestaurantCard
                title={item.nama}
                description={item.deskripsi}
                imageUrl={item.foto_utama?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
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

export default SearchPage;
