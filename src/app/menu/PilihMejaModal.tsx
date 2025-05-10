"use client";

import { useState } from "react";
import { X } from "lucide-react";
import KonfirmasiPesananModal from "@/app/menu/KonfirmasiPesananModal";
import ReceiptModal from "@/app/menu/ReceiptModal"; // ← Tambahkan import ini

import { useRouter } from "next/navigation"; // ← Import router untuk navigasi

interface Table {
  id: string;
  available: boolean;
}

interface PilihMejaModalProps {
  onClose: () => void;
  onSubmit: (tableId: string) => void;
}

export default function PilihMejaModal({
  onClose,
  onSubmit,
}: PilihMejaModalProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false); // ← State baru buat Receipt
  const router = useRouter();

  const tables: Table[] = [
    { id: "01", available: true },
    { id: "02", available: true },
    { id: "03", available: false },
    { id: "04", available: true },
    { id: "05", available: true },
    { id: "06", available: true },
    { id: "07", available: true },
    { id: "08", available: false },
    { id: "09", available: true },
    { id: "10", available: true },
  ];

  const handleSubmit = () => {
    if (selectedTable) {
      setShowConfirmModal(true); // Buka modal konfirmasi
    }
  };

  const handleConfirm = () => {
    if (selectedTable) {
      setShowConfirmModal(false); // Tutup modal konfirmasi
      setShowReceiptModal(true);  // Buka modal nota
    }
  };

  const handleFinish = () => {
    if (selectedTable) {
      onSubmit(selectedTable); // Submit meja yang dipilih
      setShowReceiptModal(false); // Tutup nota
      onClose(); // Tutup modal pilih meja
      router.push("/Restoran"); // Arahkan ke halaman restoran
    }
  };

  return (
    <>
      {/* Modal Pilih Meja */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#481111]"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-6">Denah Restoran</h2>

          {/* Denah Gambar */}
          <div className="mb-6">
            <img
              src="/denah-restoran.png"
              alt="Denah Restoran"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Pilih Meja */}
          <div className="mb-4">
            <p className="font-semibold mb-2 text-center">Pilih Nomor Meja</p>
            <div className="grid grid-cols-4 gap-2">
              {tables.map((table) => (
                <button
                  key={table.id}
                  disabled={!table.available}
                  onClick={() => setSelectedTable(table.id)}
                  className={`p-2 rounded-md text-sm font-semibold transition-all duration-200
                    ${
                      selectedTable === table.id
                        ? "bg-white text-[#481111] border-3 border-[#481111]"
                        : table.available
                        ? "bg-gray-200 text-black hover:bg-[#d6b5b5]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                >
                  {table.id}
                </button>
              ))}
            </div>
          </div>

          {/* Status Keterangan */}
          <div className="flex justify-center items-center space-x-4 mb-6 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-400 rounded" />
              <span>Tidak Tersedia</span>
            </div>
          </div>

          {/* Tombol Pesan */}
          <button
            onClick={handleSubmit}
            disabled={!selectedTable}
            className={`w-full py-2 rounded-md font-bold transition
              ${
                selectedTable
                  ? "bg-[#481111] text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Pesan
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Pesanan */}
      {showConfirmModal && (
        <KonfirmasiPesananModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          data={{
            namaPemesan: "Ziven Rifat",
            phoneNumber: "09876465xxx",
            email: "ziven.ziven@gmail.com",
            namaRestoran: "Warung Sambal Bakar",
            tanggal: "Senin, 05 April, 2025",
            waktu: "10:00 - 10:30 WIB",
            jumlahOrang: 2,
            totalHarga: 80000,
          }}
        />
      )}

      {/* Modal Nota (Receipt) */}
      {showReceiptModal && (
        <ReceiptModal
          onClose={() => setShowReceiptModal(false)}
          onFinish={handleFinish} // ← Handle klik "Selesai"
        />
      )}
    </>
  );
}
