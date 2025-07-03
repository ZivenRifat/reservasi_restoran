import React from 'react';
import { X, Printer, Check } from 'lucide-react';

export interface Reservasi {
  id?: string;
  nama: string;
  jumlah_orang: number;
  waktu: string;
  nomor_meja: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  tanggal?: string;
  no_telepon?: string;
  catatan?: string;
}

interface DetailReservasiModalProps {
  reservasi: Reservasi | null;
  isOpen: boolean;
  onClose: () => void;
  onKonfirmasi: (id: string) => Promise<void>;
  onBatalkan: (id: string) => Promise<void>;
  showCetakNota: boolean;
}

const DetailReservasiModal: React.FC<DetailReservasiModalProps> = ({
  reservasi,
  isOpen,
  onClose,
  onKonfirmasi,
  onBatalkan,
  showCetakNota = false
}) => {
  if (!isOpen || !reservasi) return null;

  const handleCetakNota = () => {
    window.print();
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Detail Reservasi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Nama</label>
            <p className="font-medium">{reservasi.nama}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Jumlah Orang</label>
              <p className="font-medium">{reservasi.jumlah_orang} orang</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Nomor Meja</label>
              <p className="font-medium">{reservasi.nomor_meja}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tanggal</label>
              <p className="font-medium">{reservasi.tanggal || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Waktu</label>
              <p className="font-medium">{reservasi.waktu}</p>
            </div>
          </div>

          {reservasi.no_telepon && (
            <div>
              <label className="text-sm text-gray-600">No. Telepon</label>
              <p className="font-medium">{reservasi.no_telepon}</p>
            </div>
          )}

          {reservasi.catatan && (
            <div>
              <label className="text-sm text-gray-600">Catatan</label>
              <p className="font-medium">{reservasi.catatan}</p>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(reservasi.status)}`}>
              {reservasi.status === 'confirmed' ? 'Dikonfirmasi' :
               reservasi.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {reservasi.status === 'pending' && reservasi.id && (
            <>
              <button
                onClick={() => onKonfirmasi(reservasi.id!)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Konfirmasi
              </button>
              <button
                onClick={() => onBatalkan(reservasi.id!)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <X size={16} />
                Batalkan
              </button>
            </>
          )}

          {showCetakNota && reservasi.status === 'confirmed' && (
            <button
              onClick={handleCetakNota}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Cetak Nota
            </button>
          )}

          <button
            onClick={onClose}
            className={`flex-1 ${reservasi.status !== 'pending' || showCetakNota ? 'bg-gray-300 text-gray-700' : 'bg-gray-300 text-gray-700'} py-2 px-4 rounded-lg hover:bg-gray-400`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailReservasiModal;