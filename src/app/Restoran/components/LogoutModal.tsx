'use client'; // Pastikan ini ada karena menggunakan hooks React

import React from 'react';

interface LogoutModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ show, onClose, onConfirm }: LogoutModalProps) {
  // Jika show adalah false, tidak render apa-apa
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          {/* Icon Peringatan */}
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
          Konfirmasi Logout
        </h2>
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          Apakah Anda yakin ingin keluar dari sistem?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  );
}