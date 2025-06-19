import React from "react";
import { MenuItem } from "@/app/types";

type Props = {
  cart: { [key: string]: number };
  makanan: MenuItem[];
  minuman: MenuItem[];
  onClose: () => void;
  onPilihMeja: () => void;
};

const TotalPesananModal: React.FC<Props> = ({
  cart,
  makanan,
  minuman,
  onClose,
  onPilihMeja,
}) => {
  const getTotal = () => {
    const allItems = [...makanan, ...minuman];
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = allItems.find((i) => i.menu_id === id);
      return total + (item ? Number(item.harga) * qty : 0);
    }, 0);
  };

  const allItems = [...makanan, ...minuman];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative z-60">
        {/* Tombol silang kanan atas */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Tutup modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-xl font-semibold mb-4">Total Pesanan</h3>
        <ul className="max-h-60 overflow-y-auto mb-6">
          {Object.entries(cart).map(([id, qty]) => {
            const item = allItems.find((i) => i.menu_id === id);
            if (!item) return null;
            return (
              <li key={id} className="flex justify-between mb-2">
                <span>
                  {item.nama} x{qty}
                </span>
                <span>Rp {(Number(item.harga) * qty).toLocaleString()}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between font-bold text-lg mb-6">
          <span>Total</span>
          <span>Rp {getTotal().toLocaleString()}</span>
        </div>

        {/* Tombol pilih meja di tengah bawah dengan lebar hampir penuh */}
        <div className="flex justify-center">
          <button
            onClick={onPilihMeja}
            className="w-full max-w-md px-6 py-3 rounded bg-[#481111] text-white hover:bg-[#6b1b1b] font-semibold transition"
          >
            Pilih Meja
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalPesananModal;
