import { notFound } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import OrderForm from "./OrderForm";
import { API_URL } from "@/constant";

interface Foto {
  id: string;
  nama_file: string;
  url: string;
}

interface Menu {
  id: string;
  nama: string;
  deskripsi: string;
  jenis: string;
  harga: string;
  foto: string;
  status: string;
  highlight: number;
}

interface PenggunaUlasan {
  nama: string;
  foto: string | null;
}

// REVISI 1: Sesuaikan tipe data ulasan agar cocok dengan API
interface Ulasan {
  id: string;
  rating: number; // Rating sekarang adalah number
  komentar: string;
  pengulas: string; // Nama pengguna
  tanggal: string; // Tanggal ulasan
}

interface Restoran {
  id: string;
  nama: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  foto_utama: Foto;
  foto: Foto[];
  menu: Menu[];
  ulasan: Ulasan[];
  rata_rata_rating: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <svg
          key={starValue}
          className={`w-5 h-5 ${
            rating >= starValue ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.37 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.37-2.446a1 1 0 00-1.175 0l-3.37 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.054 9.387c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.96z" />
        </svg>
      ))}
    </div>
  );
};

const UserIcon = () => {
    return (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        </div>
    )
}


const BASE_URL = `${API_URL}/api/restoran`;

export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`${BASE_URL}/${params.id}`, { cache: "no-store" });
  if (!res.ok) return notFound();

  const json = await res.json();
  const data: Restoran = json.data;

  const ulasanData = data.ulasan || [];

  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen px-6 md:px-20 pt-4 pb-16">
        {/* Foto */}
        {/* REVISI 2: Perbaiki kelas tinggi (height) untuk tata letak yang lebih baik */}
        <section className="grid grid-cols-4 grid-rows-2 gap-2 mb-6 h-135 py-10">
          <div className="col-span-2 row-span-2">
            <img
              src={data.foto_utama.url}
              alt="Main Restaurant"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {data.foto.slice(1, 4).map((foto: Foto) => (
            <img
              key={foto.id}
              src={foto.url}
              alt={foto.nama_file}
              className="w-full h-full object-cover rounded-lg"
            />
          ))}
          <div className="bg-gray-400 text-white text-center flex items-center justify-center rounded-lg cursor-pointer">
            Lihat Semua Foto
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Kiri */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{data.nama}</h2>
              {/* Menampilkan rata-rata rating */}
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={data.rata_rata_rating} />
                <span className="text-sm text-gray-600">
                  {data.rata_rata_rating.toFixed(1)} ({ulasanData.length}{" "}
                  ulasan)
                </span>
              </div>
              <p className="text-gray-600 mt-1">{data.lokasi}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {data.deskripsi}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Status</h4>
              <span
                className={`text-sm font-medium ${
                  data.status === "buka" ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.status === "buka" ? "🟢 Buka" : "🔴 Tutup"}
              </span>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4">Highlight Menu</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.menu
                  .filter((m: Menu) => m.highlight === 1)
                  .map((menu: Menu) => (
                    <img
                      key={menu.id}
                      src={`${API_URL}/menu/${menu.foto}`}
                      alt={menu.nama}
                      className="w-full h-36 object-cover rounded shadow"
                    />
                  ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4 text-xl">Ulasan Pengguna</h3>
              <div className="space-y-6">
                {ulasanData.length > 0 ? (
                  ulasanData.map((ulasan) => (
                    // REVISI 3: Sesuaikan JSX untuk menampilkan ulasan sesuai data baru
                    <div
                      key={ulasan.id}
                      className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <UserIcon />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{ulasan.pengulas}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(ulasan.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <StarRating rating={ulasan.rating} />
                        </div>
                        <p className="mt-2 text-gray-700 text-sm">
                          {ulasan.komentar}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    Belum ada ulasan untuk restoran ini.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Kanan */}
          <div className="w-full lg:w-80 bg-white p-6 rounded shadow h-fit">
            <h3 className="font-semibold mb-4">Buat Pesanan</h3>
            <OrderForm restoranId={data.id} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
