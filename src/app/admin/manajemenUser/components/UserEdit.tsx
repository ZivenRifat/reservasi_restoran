import { X, Save } from 'lucide-react';

type User = {
  id: string;
  nama: string;
  email: string;
  peran: string;
  no_hp: string;
  created_at: string;
  NIB?: string; // Menambahkan NIB sebagai opsional, karena hanya ada untuk pemilik
};

type EditForm = {
  nama: string;
  email: string;
  no_hp: string;
  NIB?: string; // Menambahkan NIB ke dalam EditForm
};

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  editForm: EditForm;
  loading: boolean;
  activeTab: 'pelanggan' | 'pemilik';
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (form: EditForm) => void;
}

export default function EditUserModal({
  isOpen,
  user,
  editForm,
  loading,
  activeTab,
  onClose,
  onSubmit,
  onFormChange
}: EditUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit {activeTab === 'pelanggan' ? 'Pelanggan' : 'Pemilik Restoran'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama
            </label>
            <input
              type="text"
              value={editForm.nama}
              onChange={(e) => onFormChange({...editForm, nama: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => onFormChange({...editForm, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No HP
            </label>
            <input
              type="text"
              value={editForm.no_hp}
              onChange={(e) => onFormChange({...editForm, no_hp: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nomor HP"
            />
          </div>

          {activeTab === 'pemilik' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIB
              </label>
              <input
                type="text"
                value={editForm.NIB || ''} // Gunakan NIB dari editForm
                onChange={(e) => onFormChange({...editForm, NIB: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan NIB"
              />
            </div>
          )}
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}