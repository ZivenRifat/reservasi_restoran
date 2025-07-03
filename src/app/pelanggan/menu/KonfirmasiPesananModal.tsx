"use client";

import { X } from "lucide-react";
// REVISI: Impor useState untuk mengelola input catatan
import { useState } from "react";

interface MenuItem {
  nama: string;
  jumlah: number;
  subtotal: number;
}

interface KonfirmasiPesananModalProps {
  onClose: () => void;
  // REVISI: onConfirm sekarang akan mengirimkan string catatan kembali
  onConfirm: (catatan: string) => void;
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
  // REVISI: Tambahkan state untuk input catatan
  const [catatan, setCatatan] = useState(data.catatan || "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#481111]">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-center mb-6">Konfirmasi Pesanan Anda</h2>

        <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
          {/* ... (Informasi umum lainnya tidak berubah) ... */}
          <div className="flex justify-between"><span className="font-semibold">Nama Pemesan</span><span>{data.namaPemesan}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Phone Number</span><span>{data.phoneNumber}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Email</span><span>{data.email}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Nama Restoran</span><span>{data.nama}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Tanggal</span><span>{data.tanggal}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Jam</span><span>{data.jam}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Jumlah Orang</span><span>{data.jumlah_orang}</span></div>
          {data.nomor_kursi !== undefined && <div className="flex justify-between"><span className="font-semibold">Nomor Meja</span><span>{data.nomor_kursi}</span></div>}
          
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
          <div className="flex justify-between font-semibold mt-4 border-t pt-2">
            <span>Total Harga Pesanan</span>
            <span>Rp {data.totalHarga.toLocaleString('id-ID')}</span>
          </div>

          {/* REVISI: Ganti tampilan catatan menjadi textarea */}
          <div className="mt-4">
            <label htmlFor="catatan" className="font-semibold block mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              rows={3}
              placeholder=""
            ></textarea>
          </div>
        </div>

        {/* Tombol Konfirmasi */}
        <button
          // REVISI: Panggil onConfirm dengan state catatan terbaru
          onClick={() => onConfirm(catatan)}
          className="mt-6 w-full bg-[#481111] text-white font-bold py-2 rounded-md"
        >
          Konfirmasi & Pesan
        </button>
      </div>
    </div>
  );
}