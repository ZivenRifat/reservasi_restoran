import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // Optional prop for custom max-width
  withBackdrop?: boolean; // Optional: apakah mau pakai backdrop hitam atau tidak
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl', // Default max-width
  withBackdrop = false, // default: no backdrop hitam
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      {/* Backdrop jika diinginkan */}
      {withBackdrop && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Modal Content */}
      <div
        className={`relative z-50 bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
