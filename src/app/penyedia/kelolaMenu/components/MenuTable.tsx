import React from 'react';
import { Pencil, Trash2, ImageIcon } from 'lucide-react';
import { API_URL } from '@/constant';

interface MenuItem {
  id?: string;
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
  foto: string | File;
}

interface MenuTableProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  BASE_URL: string;
}

export const MenuTable: React.FC<MenuTableProps> = ({
  menuItems,
  isLoading,
  onEdit,
  onDelete,
  BASE_URL,
}) => {
  const formatCurrency = (value: string): string => {
    const numValue = parseInt(value, 10);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(isNaN(numValue) ? 0 : numValue);
  };

  const getImageUrl = (foto: string | File): string => {
    // Jika foto adalah File object, return placeholder
    if (foto instanceof File) {
      return `${API_URL}menu/placeholder-image.png`;
    }
    
    // Jika foto kosong atau null
    if (!foto || foto === '') {
      return `${API_URL}menu/placeholder-image.png`;
    }
    
    // Jika foto sudah berupa URL lengkap
    if (foto.startsWith('http')) {
      return foto;
    }
    
    // Jika foto hanya nama file, gabungkan dengan base URL
    return `${API_URL}menu/${foto}`;
  };

  const getStatusDisplay = (status: string): string => {
    // Normalisasi status untuk display
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'tersedia':
        return 'Tersedia';
      case 'tidak tersedia':
      case 'habis':
        return 'Tidak Tersedia';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'tersedia':
        return 'bg-green-100 text-green-800';
      case 'tidak tersedia':
      case 'habis':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.src = `${API_URL}menu/placeholder-image.png`;
  };

  const handleEdit = (item: MenuItem): void => {
    // Pastikan foto berupa string untuk editing
    const editItem: MenuItem = {
      ...item,
      foto: typeof item.foto === 'string' ? item.foto : '',
    };
    onEdit(editItem);
  };

  const handleDelete = (item: MenuItem): void => {
    if (item.id) {
      onDelete(item.id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-2 text-gray-600">Memuat data menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menu
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">Tidak ada menu yang tersedia.</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Silakan tambahkan menu baru untuk memulai.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              menuItems.map((item, index) => (
                <tr 
                  key={item.id || `menu-${index}`} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          src={getImageUrl(item.foto)}
                          alt={item.nama || 'Menu'}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.nama || 'Nama menu tidak tersedia'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.harga)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                      className="text-sm text-gray-600 max-w-xs" 
                      title={item.deskripsi}
                    >
                      <p className="line-clamp-2">
                        {item.deskripsi || 'Deskripsi tidak tersedia'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                    >
                      {getStatusDisplay(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        onClick={() => handleEdit(item)}
                        title="Edit menu"
                        type="button"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        onClick={() => handleDelete(item)}
                        title="Hapus menu"
                        type="button"
                        disabled={!item.id}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};