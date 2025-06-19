import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative">
        <img src={imageUrl} alt="Restaurant" className="max-w-full max-h-[80vh] rounded-lg" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-200"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
