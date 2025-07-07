// src/app/Restoran/dashboard/ReservasiTerbaruTable.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
// Import Reservasi dari DetailReservasiModal yang diekspor
import { Reservasi } from './DetailReservasiModal';

interface ReservasiTerbaruTableProps {
  reservasi: Reservasi[];
  onDetailClick: (reservasi: Reservasi) => void;
  onLihatSemua: () => void;
}

const ReservasiTerbaruTable: React.FC<ReservasiTerbaruTableProps> = ({ reservasi, onDetailClick, onLihatSemua }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Reservasi Terbaru</h3>
          <button
            onClick={onLihatSemua}
            className="text-[#A32A2A] hover:text-[#8b2424] flex items-center gap-1 text-sm"
          >
            Lihat Semua
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Orang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor Meja</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservasi.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada reservasi terbaru
                </td>
              </tr>
            ) : (
              reservasi.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.jumlah_orang}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.waktu}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.nomor_meja}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onDetailClick(item)}
                      className="bg-[#A32A2A] text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservasiTerbaruTable;