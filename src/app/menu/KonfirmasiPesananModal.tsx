"use client";

import { X } from "lucide-react";

interface KonfirmasiPesananModalProps {
  onClose: () => void;
  onConfirm: () => void;
  data: {
    namaPemesan: string;
    phoneNumber: string;
    email: string;
    namaRestoran: string;
    tanggal: string;
    waktu: string;
    jumlahOrang: number;
    totalHarga: number;
  };
}

export default function KonfirmasiPesananModal({
  onClose,
  onConfirm,
  data,
}: KonfirmasiPesananModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#481111]"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-center mb-6">Data Pesanan Anda</h2>

        {/* Data Pesanan */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Nama Pemesan</span>
            <span>{data.namaPemesan}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone number</span>
            <span>{data.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email</span>
            <span>{data.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Nama Restoran</span>
            <span>{data.namaRestoran}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tanggal</span>
            <span>{data.tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Waktu</span>
            <span>{data.waktu}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Jumlah Orang</span>
            <span>{data.jumlahOrang}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Harga Pesanan</span>
            <span>Rp {data.totalHarga.toLocaleString('id-ID')}</span>
          </div>

          {/* Catatan */}
          <div>
            <span className="font-semibold">Note</span>
            <input
              type="text"
              placeholder="Tuliskan pesan untuk restoran..."
              className="mt-1 w-full p-2 border rounded-md text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tombol Konfirmasi */}
        <button
          onClick={onConfirm}
          className="mt-6 w-full bg-[#481111] text-white font-bold py-2 rounded-md"
        >
          Konfirmasi Pesanan
        </button>
      </div>
    </div>
  );
}
