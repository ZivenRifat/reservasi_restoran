import React, { useState, useEffect } from 'react';
import { Clock, X, Check } from 'lucide-react'; // Menambahkan ikon Check untuk tombol Simpan

// Interface JamOperasional dipindahkan ke sini karena digunakan di sini
export interface JamOperasional {
  id?: string;
  restoran_id?: string;
  jam_buka: string;
  jam_tutup: string;
  created_at?: string;
  updated_at?: string;
}

interface OperationalSettingsProps {
  status: 'buka' | 'tutup'; // Status ini akan ditentukan secara otomatis dari parent
  jamOperasional: JamOperasional | null;
  // onUpdateStatus prop dihapus karena tidak lagi diperlukan untuk toggle manual
  onUpdateJamOperasional: (jamBuka: string, jamTutup: string) => Promise<void>;
}

const OperationalSettings: React.FC<OperationalSettingsProps> = ({
  status,
  jamOperasional,
  // onUpdateStatus tidak lagi diterima sebagai prop
  onUpdateJamOperasional
}) => {
  const [showJamModal, setShowJamModal] = useState(false);
  // Inisialisasi state lokal untuk jam dengan memastikan format HH:MM
  const [tempJamBuka, setTempJamBuka] = useState(
    jamOperasional?.jam_buka ? jamOperasional.jam_buka.substring(0, 5) : '08:00'
  );
  const [tempJamTutup, setTempJamTutup] = useState(
    jamOperasional?.jam_tutup ? jamOperasional.jam_tutup.substring(0, 5) : '22:00'
  );

  // Sinkronkan state lokal (tempJamBuka, tempJamTutup) saat prop jamOperasional berubah
  useEffect(() => {
    setTempJamBuka(jamOperasional?.jam_buka ? jamOperasional.jam_buka.substring(0, 5) : '08:00');
    setTempJamTutup(jamOperasional?.jam_tutup ? jamOperasional.jam_tutup.substring(0, 5) : '22:00');
  }, [jamOperasional]);

  /**
   * Menangani penyimpanan jam operasional yang baru.
   * Memanggil fungsi onUpdateJamOperasional dari parent dan menutup modal.
   */
  const handleSaveJamOperasional = async () => {
    // Memastikan format yang dikirim ke parent adalah HH:MM
    await onUpdateJamOperasional(tempJamBuka, tempJamTutup);
    setShowJamModal(false);
  };

  // handleToggleStatus dan elemen UI yang terkait dengan toggle status dihapus
  // Karena status akan otomatis ditentukan oleh jam operasional

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">Status Operasional</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bagian Status Restoran - Sekarang hanya menampilkan status yang dihitung */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status Restoran</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status === 'buka' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-semibold ${status === 'buka' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'buka' ? 'SEDANG BUKA' : 'SEDANG TUTUP'}
              </span>
            </div>
          </div>

          {/* Bagian Jam Operasional */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jam Operasional</span>
              <button
                onClick={() => setShowJamModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Atur Jam
              </button>
            </div>

            {jamOperasional ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {/* Pastikan hanya HH:MM yang ditampilkan */}
                    {jamOperasional.jam_buka.substring(0, 5)} - {jamOperasional.jam_tutup.substring(0, 5)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 ml-6">
                  Setiap hari
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Belum diatur</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Atur Jam Operasional */}
      {showJamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Atur Jam Operasional</h3>
              <button
                onClick={() => setShowJamModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Buka
                </label>
                <input
                  type="time"
                  value={tempJamBuka}
                  onChange={(e) => setTempJamBuka(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Tutup
                </label>
                <input
                  type="time"
                  value={tempJamTutup}
                  onChange={(e) => setTempJamTutup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveJamOperasional}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" /> Simpan
              </button>
              <button
                onClick={() => setShowJamModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OperationalSettings;
