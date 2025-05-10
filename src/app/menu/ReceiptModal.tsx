"use client";

import { X } from "lucide-react";

interface ReceiptModalProps {
  onClose: () => void;
  onFinish: () => void;
}

export default function ReceiptModal({ onClose, onFinish }: ReceiptModalProps) {
  return (
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
        <h2 className="text-xl font-bold text-center mb-4">Nota</h2>

        {/* ID Reservasi */}
        <p className="text-center font-bold mb-4">ID RESERVASI: 100##</p>

        {/* Detail Pemesanan */}
        <div className="space-y-2 text-sm">
          <p><strong>Nama Pemesan:</strong> Ziven Rifat</p>
          <p><strong>Nomor Hp:</strong> 09876465xxx</p>
          <p><strong>Email:</strong> ziven.ziven@gmail.com</p>
          <p><strong>Nama Restoran:</strong> Warung Sambal Bakar</p>
          <p><strong>Tanggal:</strong> Jumat 11 April, 2025</p>
          <p><strong>Waktu:</strong> 10:00 - 10:30AM</p>
          <p><strong>Jumlah Orang:</strong> 2</p>
          <p><strong>Jumlah yang perlu dibayar:</strong> Rp 80.000</p>
          <div className="text-sm mt-4">
            <strong>Status:</strong>
            <ul className="list-disc list-inside">
              <li>Created at 9:05 WIB by customer</li>
              <li>Deposited at 9:35 WIB</li>
              <li>Come restaurant at 08:00 WIB</li>
            </ul>
          </div>
        </div>

        {/* Tombol Selesai */}
        <button
          onClick={onFinish}
          className="w-full py-2 mt-6 rounded-md bg-[#481111] text-white font-bold"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
