import { X, UserPlus, Upload, FileText } from 'lucide-react';

// Definisi tipe untuk form penambahan user/resto
type AddForm = {
  nama: string;
  email: string;
  no_hp: string;
  // ALAMAT DIGANTI DENGAN LOKASI
  lokasi: string; // NAMA FIELD DIGANTI DARI 'alamat' MENJADI 'lokasi'
  deskripsi: string;
  NIB: string;
  nama_resto: string;
  status: string;
  kontak: string;
  surat: File | null;
  kata_sandi: string;
};

// Interface untuk props komponen AddRestaurantModal
interface AddRestaurantModalProps {
  isOpen: boolean;
  addForm: AddForm;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (form: AddForm) => void;
}

// Komponen AddRestaurantModal
export default function AddRestaurantModal({
  isOpen,
  addForm,
  loading,
  onClose,
  onSubmit,
  onFormChange
}: AddRestaurantModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tambah User Penyedia
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={addForm.nama}
                onChange={(e) => onFormChange({...addForm, nama: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nama"
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => onFormChange({...addForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan email"
              />
            </div>

            {/* Input No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No HP
              </label>
              <input
                type="text"
                value={addForm.no_hp}
                onChange={(e) => onFormChange({...addForm, no_hp: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nomor HP"
              />
            </div>

            {/* Input Kata Sandi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                value={addForm.kata_sandi}
                onChange={(e) => onFormChange({...addForm, kata_sandi: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan kata sandi"
              />
            </div>

            {/* Input Nama Resto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Resto
              </label>
              <input
                type="text"
                value={addForm.nama_resto}
                onChange={(e) => onFormChange({...addForm, nama_resto: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nama resto"
              />
            </div>

            {/* Input NIB (menggantikan Lokasi) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIB
              </label>
              <input
                type="text"
                value={addForm.NIB}
                onChange={(e) => onFormChange({...addForm, NIB: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan NIB"
              />
            </div>

            {/* Input Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={addForm.status}
                onChange={(e) => onFormChange({...addForm, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Pilih Status</option>
                <option value="buka">Buka</option>
                <option value="tutup">Tutup</option>
              </select>
            </div>

            {/* Input Kontak */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontak
              </label>
              <input
                type="text"
                value={addForm.kontak}
                onChange={(e) => onFormChange({...addForm, kontak: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan kontak (ex: nomor telepon, email)"
              />
            </div>
          </div>

          {/* Input LOKASI (SEKARANG UNTUK ALAMAT) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <textarea
              value={addForm.lokasi} // Menggunakan field 'lokasi'
              onChange={(e) => onFormChange({...addForm, lokasi: e.target.value})} // Mengupdate field 'lokasi'
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan lokasi (alamat)"
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={addForm.deskripsi}
              onChange={(e) => onFormChange({...addForm, deskripsi: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan deskripsi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Surat (File Upload) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surat
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onFormChange({...addForm, surat: file});
                  }}
                  className="hidden"
                  id="surat-upload"
                />
                <label
                  htmlFor="surat-upload"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent cursor-pointer bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-sm">
                    {addForm.surat ? addForm.surat.name : 'Pilih file surat...'}
                  </span>
                </label>
                {addForm.surat && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <FileText size={14} />
                    <span>File terpilih: {addForm.surat.name}</span>
                    <button
                      type="button"
                      onClick={() => onFormChange({...addForm, surat: null})}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG (Max: 5MB)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-red-800 rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <UserPlus size={16} />
            )}
            {loading ? 'Menambah...' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}