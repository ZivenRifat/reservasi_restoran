"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PilihMejaModal from "@/app/menu/PilihMejaModal";
import TotalPesananModal from "@/app/menu/TotalPesananModal";
import type { MenuItem } from "@/app/types";

const MenuPage = () => {
  const { id: restoranId } = useParams();
  const searchParams = useSearchParams();
  const jumlah_orang = searchParams.get("orang") || "1";
  const tanggal = searchParams.get("tanggal") || "";
  const waktu = searchParams.get("waktu") || "";

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
    if (!restoranId) return;

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/restoran/${restoranId}`
        );
        if (!res.ok) throw new Error("Gagal fetch detail restoran");

        const json = await res.json();
        if (json.status !== "success") {
          throw new Error(json.message || "Error dari server");
        }

        const menuData: MenuItem[] = json.data.menu.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          harga: Number(item.harga),
          foto: `http://127.0.0.1:8000/menu/${item.foto}`,
          jenis: item.jenis,
          deskripsi: item.deskripsi,
          status: item.status,
          highlight: item.highlight,
        }));

        setMakanan(menuData.filter((item) => item.jenis === "makanan"));
        setMinuman(menuData.filter((item) => item.jenis === "minuman"));
        setTables(json.data.meja || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restoranId]);

  const handleAdd = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] : 1,
    }));
  };

  const handleIncrement = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      if (prev[id] === 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: prev[id] - 1 };
    });
  };

  const getTotal = () => {
    const allItems = [...makanan, ...minuman];
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = allItems.find((i) => i.id === id);
      return total + (item ? Number(item.harga) * qty : 0);
    }, 0);
  };

  const renderItems = (items: MenuItem[]) =>
    items.map((item) => (
      <div
        key={item.id}
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

        {cart[item.id] ? (
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold select-none"
              onClick={() => handleDecrement(item.id)}
            >
              −
            </button>
            <span className="w-6 text-center">{cart[item.id]}</span>
            <button
              type="button"
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold select-none"
              onClick={() => handleIncrement(item.id)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleAdd(item.id)}
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
          restoranId={restoranId as string}
          menu={[...makanan, ...minuman]}
          tables={tables}
          jumlah_orang={jumlah_orang}
          tanggal={tanggal}
          waktu={waktu}
          onClose={() => setIsPilihMejaOpen(false)}
          onSubmit={async (tableId) => {
            setSelectedTable(tableId);
            setIsPilihMejaOpen(false);

            const menuItems = Object.entries(cart).map(([menu_id, jumlah]) => ({
              menu_id,
              jumlah,
            }));

            const getCookie = (name: string) => {
              const match = document.cookie.match(
                new RegExp("(^| )" + name + "=([^;]+)")
              );
              if (match) return match[2];
              return null;
            };

            const token = getCookie("token");

            try {
              const res = await fetch("http://127.0.0.1:8000/api/reservasi", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  restoran_id: restoranId,
                  kursi_id: tableId,
                  tanggal,
                  waktu,
                  jumlah_orang: Number(jumlah_orang),
                  catatan: "Mohon kursi dekat jendela.",
                  menu: menuItems,
                }),
              });

              const json = await res.json();

              if (!res.ok || json.status !== "success") {
                alert(
                  `Gagal reservasi: ${json.message || "Terjadi kesalahan"}`
                );
              } else {
                alert("Reservasi berhasil!");
                console.log("Reservasi:", json.data);
              }
            } catch (error) {
              console.error("Error:", error);
              alert("Terjadi kesalahan saat mengirim reservasi.");
            }
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default MenuPage;
