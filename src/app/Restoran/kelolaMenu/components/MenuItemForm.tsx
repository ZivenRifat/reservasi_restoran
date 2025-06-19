// components/menu/MenuItemForm.tsx
import React from 'react';

interface MenuItem {
  id?: string;
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
  foto: File | string;
}

interface MenuItemFormProps {
  formData: MenuItem;
  onInputChange: (field: keyof MenuItem, value: any) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  isLoading: boolean;
  isEdit: boolean;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  formData,
  onInputChange,
  onFileChange,
  previewImage,
  isLoading,
  isEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Menu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={(e) => onInputChange('nama', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Masukkan nama menu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Harga <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.harga}
            onChange={(e) => onInputChange('harga', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Masukkan harga"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.deskripsi}
          onChange={(e) => onInputChange('deskripsi', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Masukkan deskripsi menu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="Tersedia">Tersedia</option>
          <option value="Kosong">Kosong</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Menu</label>
        <div className="space-y-2">
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <small className="text-gray-500">Ukuran maksimal 5MB. Format gambar (jpeg/png/webp).</small>
          {previewImage && (
            <div className="relative w-32 h-32 mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Menyimpan...</p>}
    </div>
  );
};
