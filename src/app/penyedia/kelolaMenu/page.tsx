'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Upload, Edit, Trash2, X, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../../penyedia/kelolaMenu/components/Modal';
import { MenuItemForm } from '../../penyedia/kelolaMenu/components/MenuItemForm';
import { MenuTable } from '../../penyedia/kelolaMenu/components/MenuTable';
import { MenuHeader } from '../../penyedia/kelolaMenu/components/MenuHeader';
import { MenuFilterSearch } from '../../penyedia/kelolaMenu/components/MenuFilterSearch';
import { DeleteConfirmationModal } from '../../penyedia/kelolaMenu/components/DeleteConfirmationModal';
import { API_URL } from '@/constant';
import { useRouter } from 'next/navigation';

// --- Helper Function for Cookies ---
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// --- Interface Definitions - FIXED ---
export interface MenuItem {
  id: string; 
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
  jenis: string;
  foto: string | File;
}

// Interface untuk form (id bisa kosong saat tambah menu baru)
export interface MenuItemForm {
  id?: string;
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
  jenis: string;
  foto: string | File;
}

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

interface ApiListResponse {
  status: string;
  message: string;
  data: RawMenuItem[];
}

interface ApiSingleResponse {
  status: string;
  message: string;
  data: RawMenuItem;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

// --- Main Component ---
export default function KelolaMenuPage() {
  const router = useRouter();

  // --- API Configuration ---
  const BASE_URL = `${API_URL}/api/penyedia/menu`;
  const BASE_IMAGE_SERVER_URL = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL || 'http://127.0.0.1:8000/';

  // --- State Variables ---
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
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
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: '' });
  
  // ✅ FIXED: Gunakan interface MenuItemForm untuk form
  const [form, setForm] = useState<MenuItemForm>({
    nama: '',
    harga: '',
    deskripsi: '',
    status: 'Tersedia',
    jenis: 'makanan',
    foto: '',
  });

  // --- Utility Functions ---
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);

  const normalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'tersedia': 'Tersedia',
      'tidak_tersedia': 'Tidak Tersedia',
    };
    return statusMap[status] || 'Tersedia';
  };

  const denormalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Tersedia': 'tersedia',
      'Tidak Tersedia': 'tidak_tersedia',
    };
    return statusMap[status] || 'tersedia';
  };

  // ✅ FIXED: Pastikan id selalu ada dan tidak kosong
  const normalizeMenuData = useCallback((rawData: RawMenuItem[]): MenuItem[] => {
    return rawData
      .filter(item => item.id && item.id.trim() !== '') // Filter data yang tidak memiliki id valid
      .map((item) => ({
        id: item.id, // Sudah dipastikan ada karena di-filter
        nama: item.nama || '',
        harga: item.harga || '',
        deskripsi: item.deskripsi || '',
        status: normalizeStatus(item.status),
        jenis: item.jenis || 'makanan',
        foto: item.foto_url || (item.foto
          ? `${BASE_IMAGE_SERVER_URL}menu/${item.foto}`
          : `${BASE_IMAGE_SERVER_URL}menu/placeholder-image.png`),
      }));
  }, [BASE_IMAGE_SERVER_URL]);

  // --- API Call Functions ---
  const filterMenu = useCallback((): void => {
    let currentFiltered = menu;

    if (searchTerm.trim()) {
      currentFiltered = currentFiltered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'Semua') {
      currentFiltered = currentFiltered.filter(item => item.status === statusFilter);
    }

    setFilteredMenu(currentFiltered);
  }, [menu, searchTerm, statusFilter]);

  // ✅ FIXED: Gunakan MenuItemForm untuk validasi
  const validateForm = useCallback((): boolean => {
    console.log('Validating form:', form);
    if (!form.nama.trim() || !form.harga.trim() || !form.deskripsi.trim() || !form.jenis.trim()) {
      showNotification('Mohon lengkapi semua field yang wajib diisi (Nama, Harga, Deskripsi, Jenis)', 'error');
      console.log('Validation failed: Missing required fields');
      return false;
    }

    const hargaNumber = Number(form.harga);
    if (isNaN(hargaNumber) || hargaNumber <= 0) {
      showNotification('Harga harus berupa angka yang valid dan lebih besar dari 0', 'error');
      console.log('Validation failed: Invalid harga');
      return false;
    }

    console.log('Validation passed');
    return true;
  }, [form, showNotification]);

  const fetchMenu = useCallback(async (): Promise<void> => {
    if (!authToken) {
      showNotification('Token autentikasi tidak ditemukan. Mohon login.', 'error');
      setIsLoading(false);
      setMenu([]);
      setFilteredMenu([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching menu data...');

      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      });

      console.log('Fetch response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) { /* ignore JSON parse error */ }
        throw new Error(errorMessage);
      }

      const response: ApiListResponse = await res.json();
      console.log('Fetch response received:', response);

      if (response.status === 'success') {
        const normalizedData = normalizeMenuData(response.data || []);
        setMenu(normalizedData);
        console.log('Menu data updated, count:', normalizedData.length);
      } else {
        throw new Error(response.message || 'Failed to fetch menu');
      }
    } catch (error: any) {
      console.error('Fetch menu error:', error);
      showNotification(`Gagal memuat data menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
      setMenu([]);
      setFilteredMenu([]);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, authToken, normalizeMenuData, showNotification]);

  const searchMenu = useCallback(async (query: string): Promise<void> => {
    if (!authToken) {
      showNotification('Autentikasi diperlukan untuk pencarian. Mohon login ulang.', 'error');
      setIsLoading(false);
      return;
    }
    if (!query.trim()) {
      filterMenu();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) { /* ignore JSON parse error */ }
        throw new Error(errorMessage);
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
    } catch (error: any) {
      console.error('Gagal search menu via API:', error);
      showNotification(`Gagal mencari menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
      filterMenu();
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, authToken, normalizeMenuData, statusFilter, filterMenu, showNotification]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!authToken) {
      showNotification('Autentikasi diperlukan untuk menyimpan menu. Mohon login ulang.', 'error');
      setIsLoading(false);
      return;
    }
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Starting form submission...');

      const formData = new FormData();
      formData.append('nama', form.nama.trim());
      formData.append('harga', form.harga.trim());
      formData.append('deskripsi', form.deskripsi.trim());
      formData.append('jenis', form.jenis);
      formData.append('status', denormalizeStatus(form.status));

      if (form.foto instanceof File) {
        formData.append('foto', form.foto);
        console.log('Foto file appended to FormData:', form.foto.name, form.foto.size, form.foto.type);
      } else {
        console.log('No new file selected or form.foto is not a File instance. (Not appending "foto" field)');
      }

      console.log('FormData contents before sending:');
      for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
      }

      let url = BASE_URL;
      let method = 'POST';

      if (editId) {
        url = `${BASE_URL}/${editId}`;
        formData.append('_method', 'PUT');
        method = 'POST';
        console.log('Submitting for EDIT. URL:', url, 'Method:', method, '_method:', 'PUT');
      } else {
        console.log('Submitting for ADD. URL:', url, 'Method:', method);
      }

      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
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

      let result: ApiSingleResponse;
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

      setShowModal(false);
      setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', jenis: 'makanan', foto: '' });
      setPreviewImage(null);
      setEditId(null);

      showNotification(editId ? 'Menu berhasil diperbarui' : 'Menu berhasil ditambahkan', 'success');

      console.log('Refreshing menu data...');
      await fetchMenu();

    } catch (error: any) {
      console.error('Form submission error (Caught in handleSubmit):', error);
      showNotification(`Gagal menyimpan menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
    } finally {
      setIsLoading(false);
      console.log('Submission process finished. isLoading set to false.');
    }
  }, [form, editId, BASE_URL, authToken, fetchMenu, showNotification, denormalizeStatus, validateForm]);

  // ✅ FIXED: Tambahkan debug log dan validasi yang lebih baik
  const handleDelete = useCallback(async (): Promise<void> => {
    console.log('handleDelete called with deleteId:', deleteId);
    
    if (!deleteId || deleteId.trim() === '') {
      console.error('No valid deleteId provided');
      showNotification('ID menu tidak valid untuk dihapus', 'error');
      return;
    }
    
    if (!authToken) {
      showNotification('Autentikasi diperlukan untuk menghapus menu. Mohon login ulang.', 'error');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Initiating delete for menu ID:', deleteId);
      const deleteUrl = `${BASE_URL}/${deleteId}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error text:', errorText);
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

      showNotification('Menu berhasil dihapus', 'success');
      console.log('Menu deleted successfully, refreshing data...');
      await fetchMenu();

    } catch (error: any) {
      console.error('Error deleting menu (Caught in handleDelete):', error);
      showNotification(`Gagal menghapus menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
      setDeleteId(null);
      console.log('Delete process completed');
    }
  }, [deleteId, BASE_URL, authToken, fetchMenu, showNotification]);

  // --- Event Handlers ---
  const handleInputChange = useCallback((field: keyof MenuItemForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);

    if (file) {
      const MAX_FILE_SIZE_MB = 2;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        showNotification(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`, 'error');
        e.target.value = '';
        setForm(prev => ({ ...prev, foto: '' }));
        setPreviewImage(null);
        console.log(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        showNotification('File harus berupa gambar.', 'error');
        e.target.value = '';
        setForm(prev => ({ ...prev, foto: '' }));
        setPreviewImage(null);
        console.log('File type is not an image.');
        return;
      }

      setForm(prev => ({ ...prev, foto: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        console.log('Image preview created.');
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, foto: '' }));
      if (!editId) {
        setPreviewImage(null);
      }
      console.log('No file selected. Foto state cleared.');
    }
  }, [editId, showNotification]);

  const openAddModal = useCallback((): void => {
    if (!authToken) {
      showNotification('Anda harus login untuk menambah menu.', 'error');
      return;
    }
    console.log('Opening Add Menu Modal');
    setEditId(null);
    setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', jenis: 'makanan', foto: '' });
    setPreviewImage(null);
    setShowModal(true);
  }, [authToken, showNotification]);

  // ✅ FIXED: Gunakan MenuItem untuk parameter tapi convert ke MenuItemForm
  const openEditModal = useCallback((item: MenuItem): void => {
    if (!authToken) {
      showNotification('Anda harus login untuk mengedit menu.', 'error');
      return;
    }
    console.log('Opening Edit Menu Modal for ID:', item.id);
    setEditId(item.id);
    setForm({
      id: item.id,
      nama: item.nama || '',
      harga: item.harga || '',
      deskripsi: item.deskripsi || '',
      status: item.status || 'Tersedia',
      jenis: item.jenis || 'makanan',
      foto: '',
    });

    if (typeof item.foto === 'string' && item.foto) {
      setPreviewImage(item.foto);
    } else {
      setPreviewImage(null);
    }

    setShowModal(true);
  }, [authToken, showNotification]);

  // ✅ FIXED: Tambahkan debug log dan validasi yang lebih baik
  const handleDeleteClick = useCallback((id: string): void => {
    console.log('Delete button clicked for ID:', id);
    
    if (!id || id.trim() === '') {
      console.error('Invalid ID provided for delete:', id);
      showNotification('ID menu tidak valid', 'error');
      return;
    }
    
    if (!authToken) {
      showNotification('Anda harus login untuk menghapus menu.', 'error');
      return;
    }
    
    console.log('Setting deleteId and showing confirmation modal');
    setDeleteId(id);
    setShowConfirmDelete(true);
  }, [authToken, showNotification]);

  const closeModal = useCallback((): void => {
    console.log('Closing modal. Resetting form and state.');
    setShowModal(false);
    setForm({ nama: '', harga: '', deskripsi: '', status: 'Tersedia', jenis: 'makanan', foto: '' });
    setPreviewImage(null);
    setEditId(null);
  }, []);

  const closeDeleteModal = useCallback((): void => {
    console.log('Closing delete confirmation modal.');
    setShowConfirmDelete(false);
    setDeleteId(null);
  }, []);

  // --- Effects ---
  useEffect(() => {
    setAuthToken(getCookie('auth_token'));
    setIsClient(true);
  }, []);

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout | number | undefined;

    const loadInitialData = async () => {
      if (isClient) {
        await fetchMenu();

        if (!authToken) {
          redirectTimer = setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      }
    };

    loadInitialData();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [fetchMenu, authToken, router, isClient]);

  useEffect(() => {
    if (isClient) {
      if (searchTerm.trim()) {
        if (authToken) {
          searchMenu(searchTerm);
        } else {
          filterMenu();
        }
      } else {
        filterMenu();
      }
    }
  }, [menu, searchTerm, statusFilter, filterMenu, searchMenu, authToken, isClient]);

  // --- Render Section ---
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
        disabled={isLoading || !authToken}
        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {isLoading ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Menu')}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Display */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <MenuHeader onAddMenu={openAddModal} isLoading={isLoading} disabled={!authToken} />

        <MenuFilterSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          disabled={!authToken}
        />

        <MenuTable
          menuItems={filteredMenu}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDeleteClick}
          BASE_IMAGE_SERVER_URL={BASE_IMAGE_SERVER_URL}
          disabledActions={!authToken}
        />

        {!isClient ? (
          <div className="text-center p-6 text-gray-400 font-semibold text-lg">
            Memuat konten...
          </div>
        ) : (
          <>
            {!authToken && !isLoading && menu.length === 0 && (
              <div className="text-center p-6 text-red-600 font-semibold text-lg">
                Token autentikasi tidak ditemukan. Silakan <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => router.push('/login')}>login</span> untuk mengelola menu.
              </div>
            )}
            {authToken && !isLoading && menu.length === 0 && !searchTerm && statusFilter === 'Semua' && (
              <div className="text-center p-6 text-gray-500 text-lg">
                Tidak ada menu yang ditemukan. Tambahkan menu baru!
              </div>
            )}
          </>
        )}

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
            disabled={!authToken}
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