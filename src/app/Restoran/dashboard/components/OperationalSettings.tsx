// src/app/Restoran/dashboard/components/OperationalSettings.tsx

import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { JamOperasional } from '../../../../components/types'; // Path disesuaikan

interface OperationalSettingsProps {
  status: 'buka' | 'tutup';
  jamOperasional: JamOperasional | null;
  onUpdateStatus: (status: 'buka' | 'tutup') => void;
  onUpdateJamOperasional: (jamBuka: string, jamTutup: string) => void;
}

const OperationalSettings: React.FC<OperationalSettingsProps> = ({
  status,
  jamOperasional,
  onUpdateStatus,
  onUpdateJamOperasional
}) => {
  const [showJamModal, setShowJamModal] = useState(false);
  const [jamBuka, setJamBuka] = useState(
    jamOperasional?.jam_buka ? jamOperasional.jam_buka.substring(0, 5) : '09:00'
  );
  const [jamTutup, setJamTutup] = useState(
    jamOperasional?.jam_tutup ? jamOperasional.jam_tutup.substring(0, 5) : '22:00'
  );

  useEffect(() => {
    setJamBuka(jamOperasional?.jam_buka ? jamOperasional.jam_buka.substring(0, 5) : '09:00');
    setJamTutup(jamOperasional?.jam_tutup ? jamOperasional.jam_tutup.substring(0, 5) : '22:00');
  }, [jamOperasional]);


  const handleSaveJamOperasional = () => {
    onUpdateJamOperasional(jamBuka, jamTutup);
    setShowJamModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-6">Status Operasional</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status Restoran</span>
              <button
                onClick={() => onUpdateStatus(status === 'buka' ? 'tutup' : 'buka')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  status === 'buka' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    status === 'buka' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status === 'buka' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-semibold ${status === 'buka' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'buka' ? 'SEDANG BUKA' : 'SEDANG TUTUP'}
              </span>
            </div>
          </div>

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

      {showJamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Atur Jam Operasional</h3>
              <button
                onClick={() => setShowJamModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
                  value={jamBuka}
                  onChange={(e) => setJamBuka(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Tutup
                </label>
                <input
                  type="time"
                  value={jamTutup}
                  onChange={(e) => setJamTutup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveJamOperasional}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowJamModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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