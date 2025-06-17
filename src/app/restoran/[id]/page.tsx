import { notFound } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import OrderForm from "./OrderForm";

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

interface Restoran {
  id: string;
  nama: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  foto_utama: Foto;
  foto: Foto[];
  menu: Menu[];
}

const BASE_URL = "http://127.0.0.1:8000/api/restoran";

export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`${BASE_URL}/${params.id}`, { cache: "no-store" });
  if (!res.ok) return notFound();

  const json = await res.json();
  const data: Restoran = json.data;

  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen px-6 md:px-20 pt-4 pb-16">
        {/* Foto */}
        <section className="grid grid-cols-4 gap-2 mb-6 py-10">
          <div className="col-span-2 row-span-2">
            <img
              src={data.foto_utama.url}
              alt="Main Restaurant"
              className="w-full h-full object-cover rounded"
            />
          </div>
          {data.foto.slice(1, 4).map((foto: Foto) => (
            <img
              key={foto.id}
              src={foto.url}
              alt={foto.nama_file}
              className="w-full h-full object-cover rounded"
            />
          ))}
          <div className="bg-gray-400 text-white text-center flex items-center justify-center rounded cursor-pointer">
            Lihat Semua Foto
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Kiri */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{data.nama}</h2>
              <p className="text-gray-600">{data.lokasi}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{data.deskripsi}</p>
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
                      src={`http://127.0.0.1:8000/menu/${menu.foto}`}
                      alt={menu.nama}
                      className="w-full h-36 object-cover rounded shadow"
                    />
                  ))}
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
