"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PilihMejaModal from "../../menu/PilihMejaModal";
import TotalPesananModal from "../../menu/TotalPesananModal";
import type { MenuItem } from "@/app/types";

const MenuPage = () => {
  const { id: restoran_id } = useParams();
  const searchParams = useSearchParams();
  const jumlah_orang = searchParams.get("orang") || "1";
  const tanggal = searchParams.get("tanggal") || "";
  const jam = searchParams.get("jam") || "";

  const [makanan, setMakanan] = useState<MenuItem[]>([]);
  const [minuman, setMinuman] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<any[]>([]);

  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPilihMejaOpen, setIsPilihMejaOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    if (!restoran_id) return;

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/restoran/${restoran_id}`
        );
        if (!res.ok) {
          let errorText = await res.text(); // Ambil raw text jika bukan JSON
          console.error(
            "Gagal reservasi. Status:",
            res.status,
            "Body:",
            errorText
          );

          alert("Terjadi kesalahan saat mengirim reservasi:\n" + errorText);
          return;
        }

        const json = await res.json();
        if (json.status !== "success") {
          throw new Error(json.message || "Error dari server");
        }

        const menuData: MenuItem[] = json.data.menu.map((item: any) => ({
          menu_id: item.id.toLowerCase(),
          nama: item.nama,
          harga: Number(item.harga),
          foto: `http://127.0.0.1:8000/menu/${item.foto}`,
          jenis: item.jenis,
          deskripsi: item.deskripsi,
          status: item.status,
          highlight: item.highlight,
        }));

        setMakanan(
          menuData.filter((item) => item.jenis?.toLowerCase() === "makanan")
        );
        setMinuman(
          menuData.filter((item) => item.jenis?.toLowerCase() === "minuman")
        );
        setTables(json.data.meja || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restoran_id]);

  const handleAdd = (menu_id: string) => {
    setCart((prev) => ({
      ...prev,
      [menu_id]: prev[menu_id] ? prev[menu_id] : 1,
    }));
  };

  const handleIncrement = (menu_id: string) => {
    setCart((prev) => ({
      ...prev,
      [menu_id]: (prev[menu_id] || 0) + 1,
    }));
  };

  const handleDecrement = (menu_id: string) => {
    setCart((prev) => {
      if (!prev[menu_id]) return prev;
      if (prev[menu_id] === 1) {
        const updated = { ...prev };
        delete updated[menu_id];
        return updated;
      }
      return { ...prev, [menu_id]: prev[menu_id] - 1 };
    });
  };

  const getTotal = () => {
    const allItems = [...makanan, ...minuman];
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = allItems.find((i) => i.menu_id === id);
      return total + (item ? Number(item.harga) * qty : 0);
    }, 0);
  };

  const renderItems = (items: MenuItem[]) =>
    items.map((item) => (
      <div
        key={item.menu_id}
        className="border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200 rounded-lg p-4 flex flex-col justify-between items-start gap-2"
      >
        <div className="w-full flex items-center justify-between">
          <div className="w-1/2">
            <div className="text-base font-semibold">{item.nama}</div>
            <p className="text-sm mt-1">Rp {item.harga.toLocaleString()}</p>
            <p className="text-xs mt-1 text-gray-500">{item.deskripsi}</p>
          </div>
          <div className="flex justify-center items-center w-32 h-32">
            <img
              src={item.foto}
              alt={item.nama}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </div>

        {cart[item.menu_id] ? (
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold select-none"
              onClick={() => handleDecrement(item.menu_id)}
            >
              −
            </button>
            <span className="w-6 text-center">{cart[item.menu_id]}</span>
            <button
              type="button"
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold select-none"
              onClick={() => handleIncrement(item.menu_id)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleAdd(item.menu_id)}
            className="border-2 border-[#481111] px-6 py-2 rounded-full text-sm font-semibold mt-4 hover:bg-red-50 text-[#481111]"
          >
            Tambah
          </button>
        )}
      </div>
    ));

  if (loading) return <p className="p-4">Loading menu...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <>
      <Navbar />

      <main className="px-6 md:px-24 pt-8 pb-36">
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Makanan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderItems(makanan)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Minuman</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderItems(minuman)}
          </div>
        </section>
      </main>

      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-40">
          <div className="w-full h-23 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" />
          <div
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#481111] text-white px-6 py-3 hover:bg-[#6b1b1b] rounded-full shadow-lg z-50 flex justify-between items-center w-[90%] max-w-lg cursor-pointer"
          >
            <div className="text-sm leading-tight">
              <p className="font-bold">
                {Object.values(cart).reduce((a, b) => a + b, 0)} item
              </p>
              <p className="text-xs">Total Pesanan</p>
            </div>
            <p className="font-bold text-sm">
              Rp {getTotal().toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <TotalPesananModal
          cart={cart}
          makanan={makanan}
          minuman={minuman}
          onClose={() => setIsModalOpen(false)}
          onPilihMeja={() => {
            setIsModalOpen(false);
            setIsPilihMejaOpen(true);
          }}
        />
      )}

      {isPilihMejaOpen && (
        <PilihMejaModal
          restoran_id={restoran_id as string}
          menu={[...makanan, ...minuman]}
          tables={tables}
          jumlah_orang={jumlah_orang}
          tanggal={tanggal}
          jam={jam}
          cart={cart}
          onClose={() => setIsPilihMejaOpen(false)}
          onSubmit={(tableId) => {
            setSelectedTable(tableId);
            setIsPilihMejaOpen(false);
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default MenuPage;
