"use client";

import { X } from "lucide-react";

interface MenuItem {
  nama: string;
  jumlah: number;
  subtotal: number;
}

interface KonfirmasiPesananModalProps {
  onClose: () => void;
  onConfirm: () => void;
  data: {
    namaPemesan: string;
    phoneNumber: string;
    email: string;
    nama: string;
    tanggal: string;
    jam: string;
    jumlah_orang: number;
    totalHarga: number;
    catatan?: string;
    nomor_kursi?: number;
    menu: MenuItem[];
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
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#481111]"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-center mb-6">Data Pesanan Anda</h2>

        {/* Informasi Umum */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Nama Pemesan</span>
            <span>{data.namaPemesan}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone Number</span>
            <span>{data.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email</span>
            <span>{data.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Nama Restoran</span>
            <span>{data.nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tanggal</span>
            <span>{data.tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">jam</span>
            <span>{data.jam}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Jumlah Orang</span>
            <span>{data.jumlah_orang}</span>
          </div>

          {/* Meja */}
          {data.nomor_kursi !== undefined && (
            <div className="flex justify-between">
              <span className="font-semibold">Nomor Meja</span>
              <span>{data.nomor_kursi}</span>
            </div>
          )}

          {/* Daftar Menu */}
          <div className="mt-4">
            <span className="font-semibold">Menu Dipesan</span>
            <ul className="mt-1 text-sm text-gray-700 space-y-1">
              {data.menu.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.nama} x{item.jumlah}</span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="flex justify-between font-semibold mt-4">
            <span>Total Harga Pesanan</span>
            <span>Rp {data.totalHarga.toLocaleString('id-ID')}</span>
          </div>

          {/* Catatan */}
          {data.catatan && (
            <div>
              <span className="font-semibold">Catatan</span>
              <p className="mt-1 text-sm text-gray-700">{data.catatan}</p>
            </div>
          )}
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
