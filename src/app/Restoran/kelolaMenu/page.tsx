'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../../Restoran/kelolaMenu/components/Modal';
import { MenuItemForm } from '../../Restoran/kelolaMenu/components/MenuItemForm';
import { MenuTable } from '../../Restoran/kelolaMenu/components/MenuTable';
import { MenuHeader } from '../../Restoran/kelolaMenu/components/MenuHeader';
import { MenuFilterSearch } from '../../Restoran/kelolaMenu/components/MenuFilterSearch';
import { DeleteConfirmationModal } from '../../Restoran/kelolaMenu/components/DeleteConfirmationModal';
import { API_URL } from '@/constant';

const token = 'htojmxT3qwtSICLNEvIWk5hf1SWaJWROVwVU3Ecj1545d888'; //simpan di 
const BASE_URL = `${API_URL}/api/penyedia/menu`; 
//const BASE_IMAGE_SERVER_URL = 'http://127.0.0.1:8000/';//

// Interface yang sudah diperbaiki dan konsisten
interface MenuItem {
  id?: string;
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
  foto: string | File;
}

// Interface untuk data mentah dari API
interface RawMenuItem {
  id: string;
  restoran_id: string;
  nama: string;
  deskripsi: string;
  harga: string;
  jenis: string;
  status: string;
  foto: string | null;
  foto_url: string | null;
  highlight: boolean;
  created_at: string;
  updated_at: string;
}

// Interface untuk response API (list menu)
interface ApiListResponse {
  status: string;
  message: string;
  data: RawMenuItem[];
}

// Interface untuk response API (single menu)
interface ApiSingleResponse {
  status: string;
  message: string;
  data: RawMenuItem;
}

export default function KelolaMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<MenuItem>({
    nama: '',
    harga: '',
    deskripsi: '',
    status: 'Tersedia',
    foto: '',
  });

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoading(true);
      try {
        await fetchMenu();
      } catch (error) {
        console.error('Error loading initial menu data:', error);
        alert('Gagal memuat data menu. Periksa koneksi internet Anda.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMenu();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchMenu(searchTerm);
    } else {
      filterMenu();
    }
  }, [menu, searchTerm, statusFilter]);

  // Fungsi untuk menormalisasi status dari API ke tampilan
  const normalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'tersedia': 'Tersedia',
      'tidak_tersedia': 'Tidak Tersedia',
      'habis': 'Habis',
      'Tersedia': 'Tersedia',
      'Tidak Tersedia': 'Tidak Tersedia',
      'Habis': 'Habis'
    };
    return statusMap[status] || 'Tersedia';
  };

  // Fungsi untuk menormalisasi status dari tampilan ke API
  const denormalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Tersedia': 'tersedia',
      'Tidak Tersedia': 'tidak_tersedia',
      'Habis': 'habis'
    };
    return statusMap[status] || 'tersedia';
  };

  const normalizeMenuData = (rawData: RawMenuItem[]): MenuItem[] => {
    return rawData.map((item) => ({
      id: item.id,
      nama: item.nama || '',
      harga: item.harga || '',
      deskripsi: item.deskripsi || '',
      status: normalizeStatus(item.status),
      foto: item.foto_url || (item.foto 
        ? `${BASE_IMAGE_SERVER_URL}menu/${item.foto}`
        : `${BASE_IMAGE_SERVER_URL}menu/placeholder-image.png`),
    }));
  };

  const fetchMenu = async (): Promise<void> => {
    console.log('Fetching menu data...');
    
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      console.log('Fetch response status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const responseText = await res.text();
      console.log('Fetch response received');

      let response;
      try {
        response = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse fetch response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (response.status === 'success') {
        const normalizedData = normalizeMenuData(response.data || []);
        setMenu(normalizedData);
        console.log('Menu data updated, count:', normalizedData.length);
      } else {
        throw new Error(response.message || 'Failed to fetch menu');
      }
    } catch (error) {
      console.error('Fetch menu error:', error);
      throw error; // Re-throw untuk bisa di-catch di handleSubmit
    }
  };

  const searchMenu = async (query: string): Promise<void> => {
    if (!query.trim()) {
      filterMenu();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: ApiListResponse = await res.json();
      
      if (response.status === 'success') {
        const searchResults = normalizeMenuData(response.data || []);
        let filtered = searchResults;
        
        if (statusFilter !== 'Semua') {
          filtered = filtered.filter((item: MenuItem) => item.status === statusFilter);
        }

        setFilteredMenu(filtered);
      } else {
        throw new Error(response.message || 'Gagal melakukan pencarian');
      }
    } catch (error) {
      console.error('Gagal search menu:', error);
      // Fallback ke filter lokal jika search API gagal
      filterMenu();
    } finally {
      setIsLoading(false);
    }
  };

  const filterMenu = (): void => {
    let filtered = menu;

    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'Semua') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredMenu(filtered);
  };

  const openAddModal = (): void => {
    console.log('Opening Add Menu Modal'); // Log when opening add modal
    setEditId(null);
    setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', foto: '' });
    setPreviewImage(null);
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem): void => {
    console.log('Opening Edit Menu Modal for ID:', item.id); // Log when opening edit modal
    setEditId(item.id || null);
    setForm({
      nama: item.nama || '',
      harga: item.harga || '',
      deskripsi: item.deskripsi || '',
      status: item.status || 'Tersedia',
      foto: '', // Foto selalu direset saat edit modal dibuka, pengguna harus memilih ulang jika ingin mengubah
    });

    if (typeof item.foto === 'string' && item.foto) {
      setPreviewImage(item.foto);
    } else {
      setPreviewImage(null);
    }

    setShowModal(true);
  };

  const validateForm = (): boolean => {
    console.log('Validating form:', form); // Log form data during validation
    if (!form.nama.trim() || !form.harga.trim() || !form.deskripsi.trim()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      console.log('Validation failed: Missing required fields'); // Log reason for failure
      return false;
    }

    const hargaNumber = Number(form.harga);
    if (isNaN(hargaNumber) || hargaNumber <= 0) {
      alert('Harga harus berupa angka yang valid dan lebih besar dari 0');
      console.log('Validation failed: Invalid harga'); // Log reason for failure
      return false;
    }

    console.log('Validation passed'); // Log success
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      console.log('Starting form submission...');
      
      const formData = new FormData();
      formData.append('nama', form.nama.trim());
      formData.append('harga', form.harga.trim());
      formData.append('deskripsi', form.deskripsi.trim());
      formData.append('status', denormalizeStatus(form.status));

      // Append foto only if it's a File instance (meaning a new file was selected)
      if (form.foto instanceof File) {
        formData.append('foto', form.foto);
        console.log('Foto file appended to FormData:', form.foto.name, form.foto.size, form.foto.type);
      } else {
        console.log('No new file selected or form.foto is not a File instance. (Sending without "foto" field)');
        // Jika API backend Anda *membutuhkan* field foto, bahkan jika null,
        // Anda mungkin perlu menambahkan baris ini:
        // formData.append('foto', ''); // Atau formData.append('foto', 'null') jika API mengharapkan string 'null'
      }

      // Log the content of FormData
      console.log('FormData contents before sending:');
      for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
      }
      // End Log FormData content

      let url = BASE_URL;
      let method = 'POST'; // Default method for both add and edit (Laravel often uses POST with _method for PUT)

      if (editId) {
        url = `${BASE_URL}/${editId}`;
        formData.append('_method', 'PUT'); // Add _method=PUT for update
        console.log('Submitting for EDIT. URL:', url, 'Method:', method, '_method:', 'PUT');
      } else {
        console.log('Submitting for ADD. URL:', url, 'Method:', method);
      }

      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually.
          // The browser sets it automatically with the correct boundary when FormData is used as body.
        },
        body: formData,
      });

      console.log('Response received, status:', response.status);

      if (!response.ok) {
        const errorResponseText = await response.text();
        console.error('Response not OK:', response.status, response.statusText);
        console.error('Server error response text:', errorResponseText);
        
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorResponseText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
          console.error('Parsed error response:', errorJson);
        } catch (parseError) {
          console.error('Failed to parse error response JSON:', parseError);
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed API result:', result);
      } catch (parseError) {
        console.error('JSON parse error after successful fetch:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (result.status !== 'success') {
        console.error('API returned error status (even with 2xx HTTP code):', result);
        throw new Error(result.message || 'API returned error');
      }

      console.log('Submission successful! Closing modal...');

      // Reset form dan tutup modal TANPA refresh dulu
      setShowModal(false);
      setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', foto: '' });
      setPreviewImage(null);
      setEditId(null);

      // Tampilkan pesan sukses
      alert(editId ? 'Menu berhasil diperbarui' : 'Menu berhasil ditambahkan');

      // Refresh data menu setelah alert
      console.log('Refreshing menu data...');
      try {
        await fetchMenu();
        console.log('Menu data refreshed successfully');
      } catch (refreshError) {
        console.error('Error refreshing menu after successful submission:', refreshError);
        // Jangan throw error disini, karena submit sudah berhasil. Cukup info pengguna.
        alert('Menu berhasil disimpan, tapi gagal refresh data. Silakan reload halaman.');
      }

    } catch (error) {
      console.error('Form submission error (Caught in handleSubmit):', error);
      
      let errorMessage = 'Terjadi kesalahan yang tidak diketahui saat menyimpan menu.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(`Gagal menyimpan menu: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      console.log('Submission process finished. isLoading set to false.');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      console.log('Initiating delete for menu ID:', deleteId);
      const response = await fetch(`${BASE_URL}/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.message || errorMessage;
          console.error('Parsed delete error data:', errorData);
        } catch (parseError) {
          console.error('Failed to parse delete error response JSON:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const result: ApiSingleResponse = await response.json();
      console.log('Delete API response:', result);
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Gagal menghapus menu');
      }

      await fetchMenu();
      alert('Menu berhasil dihapus');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      console.error('Error deleting menu (Caught in handleDelete):', error);
      alert(`Gagal menghapus menu: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
      setDeleteId(null);
      console.log('Delete process finished. isLoading set to false, modal closed.');
    }
  };

  const handleInputChange = (field: keyof MenuItem, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    
    if (file) {
      // Validasi ukuran file
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        e.target.value = ''; // Reset input file
        setForm(prev => ({ ...prev, foto: '' })); // Ensure foto state is cleared
        setPreviewImage(null);
        console.log('File size exceeds 5MB limit.');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        e.target.value = ''; // Reset input file
        setForm(prev => ({ ...prev, foto: '' })); // Ensure foto state is cleared
        setPreviewImage(null);
        console.log('File type is not an image.');
        return;
      }

      setForm(prev => ({ ...prev, foto: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        console.log('Image preview created.');
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, foto: '' }));
      // Only clear preview if not in edit mode (where an existing image might be shown)
      if (!editId) { 
        setPreviewImage(null);
      }
      console.log('No file selected. Foto state cleared.');
    }
  };

  const closeModal = (): void => {
    console.log('Closing modal. Resetting form and state.');
    setShowModal(false);
    setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', foto: '' });
    setPreviewImage(null);
    setEditId(null);
  };

  const closeDeleteModal = (): void => {
    console.log('Closing delete confirmation modal.');
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const handleDeleteClick = (id: string): void => {
    console.log('Delete button clicked for ID:', id);
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const menuFormFooter = (
    <>
      <button
        onClick={closeModal}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        disabled={isLoading}
      >
        Batal
      </button>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {isLoading ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Menu')}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <MenuHeader onAddMenu={openAddModal} isLoading={isLoading} />
        
        <MenuFilterSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <MenuTable
          menuItems={filteredMenu}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDeleteClick}
          BASE_IMAGE_SERVER_URL={BASE_IMAGE_SERVER_URL}
        />

        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editId ? 'Edit Menu' : 'Tambah Menu Baru'}
          footer={menuFormFooter}
        >
          <MenuItemForm
            formData={form}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            previewImage={previewImage}
            isLoading={isLoading}
            isEdit={!!editId}
          />
        </Modal>

        <DeleteConfirmationModal
          isOpen={showConfirmDelete}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}