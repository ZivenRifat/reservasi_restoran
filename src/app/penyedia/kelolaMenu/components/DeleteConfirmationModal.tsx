import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal'; // Assuming Modal is in ../ui/Modal

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const footer = (
    <>
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        disabled={isLoading}
      >
        Batal
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {isLoading ? 'Menghapus...' : 'Hapus'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Menu"
      footer={footer}
      maxWidth="max-w-md"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
    </Modal>
  );
};