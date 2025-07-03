// components/ProfileModal.tsx
import { X, Trash2, Pencil } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-black">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center">Foto Profil Akun Anda</h2>
        <p className="text-center text-gray-600 text-sm mt-1 mb-4">
          Foto akan membantu orang lain mengenali Anda dan memberi tahu Anda saat login ke akun Anda
        </p>
        <div className="flex justify-center mb-4">
          <img
            src="/FotoProfil.jpg"
            alt="Foto Profil"
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Trash2 size={18} />
            Hapus
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Pencil size={18} />
            Ubah
          </button>
        </div>
      </div>
    </div>
  );
}
