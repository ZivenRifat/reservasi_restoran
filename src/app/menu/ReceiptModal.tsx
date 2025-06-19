"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export interface ReceiptModalProps {
  onClose: () => void;
  onFinish: () => void;
  data: {
    id: string;
    namaPemesan: string;
    phoneNumber: string;
    email: string;
    namaRestoran: string;
    tanggal: string;
    jam: string;
    jumlah_orang: number;
    totalHarga: number;
    statusLog?: string[];
    restoran_id: string;
    kursi_id: string;
    catatan: string;
    menu: {
      menu_id: string;
      jumlah: number;
    }[];
  };
}

export default function ReceiptModal({
  onClose,
  onFinish,
  data,
}: ReceiptModalProps) {
  const router = useRouter();

  const handleFinish = () => {
    onFinish(); // trigger callback
    router.push(`/restoran/${data.restoran_id}`); // redirect ke halaman restoran
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#481111]"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Nota</h2>
        <p className="text-center font-bold mb-4">ID RESERVASI: {data.id}</p>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Nama Pemesan:</strong> {data.namaPemesan}
          </p>
          <p>
            <strong>Nomor Hp:</strong> {data.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Nama Restoran:</strong> {data.namaRestoran}
          </p>
          <p>
            <strong>Tanggal:</strong> {data.tanggal}
          </p>
          <p>
            <strong>Waktu:</strong> {data.jam}
          </p>
          <p>
            <strong>Jumlah Orang:</strong> {data.jumlah_orang}
          </p>
          <p>
            <strong>Jumlah yang perlu dibayar:</strong> Rp{" "}
            {data.totalHarga.toLocaleString("id-ID")}
          </p>

          {data.statusLog && (
            <div className="text-sm mt-4">
              <strong>Status:</strong>
              <ul className="list-disc list-inside">
                {data.statusLog.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-2 mt-6 rounded-md bg-[#481111] text-white font-bold"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
