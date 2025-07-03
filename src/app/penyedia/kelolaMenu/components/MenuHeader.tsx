import React from 'react';
import { Plus } from 'lucide-react';

interface MenuHeaderProps {
  onAddMenu: () => void;
  isLoading: boolean;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ onAddMenu, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Menu</h1>
          <p className="text-gray-600 mt-1">Kelola menu restoran Anda dengan mudah</p>
        </div>
        <button
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-2 shadow-lg"
          onClick={onAddMenu}
          disabled={isLoading}
        >
          <Plus size={20} />
          Tambah Menu
        </button>
      </div>
    </div>
  );
};