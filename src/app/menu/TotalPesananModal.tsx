// app/Menu/TotalPesananModal.tsx
import React from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Props = {
  cart: { [key: number]: number };
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
      const item = allItems.find((i) => i.id === parseInt(id));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-[100] px-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-[#4A0D0D] border border-[#4A0D0D] rounded-full w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-center mb-6">
          Total Pesanan Anda
        </h2>

        <div className="space-y-4 mb-6">
          {Object.entries(cart).map(([id, qty]) => {
            const item = [...makanan, ...minuman].find(
              (i) => i.id === parseInt(id)
            );
            if (!item) return null;
            return (
              <div key={id} className="flex justify-between text-sm">
                <div>{item.name}</div>
                <div className="flex gap-2">
                  <span>{qty}x</span>
                  <span>Rp {item.price.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-bold text-base mb-4">
          <span>Total pesanan</span>
          <span>Rp {getTotal().toLocaleString()}</span>
        </div>

        <button
          onClick={onPilihMeja}
          className="bg-[#4A0D0D] text-white w-full py-2 rounded-lg font-semibold"
        >
          Pilih Meja
        </button>
      </div>
    </div>
  );
};

export default TotalPesananModal;
