"use client";

import { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PilihMejaModal from "@/app/menu/PilihMejaModal";
import TotalPesananModal from "@/app/menu/TotalPesananModal";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const makanan: MenuItem[] = Array(8).fill({
  id: 0,
  name: "Ayam Bakar Madu",
  price: 35000,
  image: "/images/Makanan.jpg",
}).map((item, index) => ({ ...item, id: index + 1 }));

const minuman: MenuItem[] = Array(8).fill({
  id: 0,
  name: "Es Teh",
  price: 5000,
  image: "/images/Minuman.jpg",
}).map((item, index) => ({ ...item, id: index + 9 }));

const MenuPage = () => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPilihMejaOpen, setIsPilihMejaOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleAdd = (id: number) => {
    setCart({ ...cart, [id]: 1 });
  };

  const handleIncrement = (id: number) => {
    setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  };

  const handleDecrement = (id: number) => {
    if (cart[id] === 1) {
      const updatedCart = { ...cart };
      delete updatedCart[id];
      setCart(updatedCart);
    } else {
      setCart({ ...cart, [id]: cart[id] - 1 });
    }
  };

  const getTotal = () => {
    const allItems = [...makanan, ...minuman];
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = allItems.find((i) => i.id === parseInt(id));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const renderItems = (items: MenuItem[]) =>
    items.map((item) => (
      <div
        key={item.id}
        className="border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200 rounded-lg p-4 flex flex-col justify-between items-start gap-2 cursor-pointer"
      >
        <div className="w-full flex items-center justify-between">
          <div className="w-1/2">
            <div className="text-base font-semibold">{item.name}</div>
            <p className="text-sm mt-1">Rp {item.price.toLocaleString()}</p>
          </div>
          <div className="flex justify-center items-center w-32 h-32">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        </div>

        {cart[item.id] ? (
          <div className="flex items-center gap-4 mt-4">
            <button
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold"
              onClick={() => handleDecrement(item.id)}
            >
              −
            </button>
            <span className="w-6 text-center">{cart[item.id]}</span>
            <button
              className="w-8 h-8 border rounded-full flex justify-center items-center text-lg font-bold"
              onClick={() => handleIncrement(item.id)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAdd(item.id)}
            className="border-2 border-[#481111] px-6 py-2 rounded-full text-sm font-semibold mt-4 hover:bg-red-50 text-[#481111]"
          >
            Tambah
          </button>
        )}
      </div>
    ));

  return (
    <>
      <Navbar />

      <main className="px-6 md:px-25 pt-8 pb-36">
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

      {/* Floating Cart */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-40">
          <div className="w-full h-23 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" />
          <div
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#4A0D0D] text-white px-6 py-3 rounded-full shadow-lg z-50 flex justify-between items-center w-[90%] max-w-lg cursor-pointer"
          >
            <div className="text-sm leading-tight">
              <p className="font-bold">
                {Object.values(cart).reduce((a, b) => a + b, 0)} item
              </p>
              <p className="text-xs">Warung Sambal Bakar, Semarang</p>
            </div>
            <p className="font-bold text-sm">
              Rp {getTotal().toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Modal Total Pesanan */}
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

      {/* Modal Pilih Meja */}
      {isPilihMejaOpen && (
        <PilihMejaModal
          onClose={() => setIsPilihMejaOpen(false)}
          onSubmit={(tableId) => {
            setSelectedTable(tableId);
            setIsPilihMejaOpen(false);
            console.log("Meja dipilih:", tableId);
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default MenuPage;
