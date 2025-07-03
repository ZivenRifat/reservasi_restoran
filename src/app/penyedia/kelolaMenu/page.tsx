'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect, useState, useCallback } from 'react';
import { Plus, Upload, Edit, Trash2, X, AlertCircle, Check } from 'lucide-react';
>>>>>>> origin/main
import { Modal } from '../../penyedia/kelolaMenu/components/Modal';
import { MenuItemForm } from '../../penyedia/kelolaMenu/components/MenuItemForm';
import { MenuTable } from '../../penyedia/kelolaMenu/components/MenuTable';
import { MenuHeader } from '../../penyedia/kelolaMenu/components/MenuHeader';
import { MenuFilterSearch } from '../../penyedia/kelolaMenu/components/MenuFilterSearch';
import { DeleteConfirmationModal } from '../../penyedia/kelolaMenu/components/DeleteConfirmationModal';
import { API_URL } from '@/constant';
<<<<<<< HEAD

const token = 'NjkeK0CD3D1kJTa7j3DzKMWwXqH6qBffQxgNeo2q1f48bb9e'; //simpan di 
const BASE_URL = `${API_URL}/api/penyedia/menu`; 
//const BASE_IMAGE_SERVER_URL = 'http://127.0.0.1:8000/';//

// Interface yang sudah diperbaiki dan konsisten
interface MenuItem {
=======
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
>>>>>>> origin/main
  id?: string;
  nama: string;
  harga: string;
  deskripsi: string;
  status: string;
<<<<<<< HEAD
  foto: string | File;
}

// Interface untuk data mentah dari API
=======
  jenis: string;
  foto: string | File;
}

>>>>>>> origin/main
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

<<<<<<< HEAD
// Interface untuk response API (list menu)
=======
>>>>>>> origin/main
interface ApiListResponse {
  status: string;
  message: string;
  data: RawMenuItem[];
}

<<<<<<< HEAD
// Interface untuk response API (single menu)
=======
>>>>>>> origin/main
interface ApiSingleResponse {
  status: string;
  message: string;
  data: RawMenuItem;
}

<<<<<<< HEAD
export default function KelolaMenuPage() {
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
  const [form, setForm] = useState<MenuItem>({
=======
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: '' });
  
  // ✅ FIXED: Gunakan interface MenuItemForm untuk form
  const [form, setForm] = useState<MenuItemForm>({
>>>>>>> origin/main
    nama: '',
    harga: '',
    deskripsi: '',
    status: 'Tersedia',
<<<<<<< HEAD
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
=======
    jenis: 'makanan',
    foto: '',
  });

  // --- Utility Functions ---
  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);

>>>>>>> origin/main
  const normalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'tersedia': 'Tersedia',
      'tidak_tersedia': 'Tidak Tersedia',
<<<<<<< HEAD
      'habis': 'Habis',
      'Tersedia': 'Tersedia',
      'Tidak Tersedia': 'Tidak Tersedia',
      'Habis': 'Habis'
=======
>>>>>>> origin/main
    };
    return statusMap[status] || 'Tersedia';
  };

<<<<<<< HEAD
  // Fungsi untuk menormalisasi status dari tampilan ke API
=======
>>>>>>> origin/main
  const denormalizeStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Tersedia': 'tersedia',
      'Tidak Tersedia': 'tidak_tersedia',
<<<<<<< HEAD
      'Habis': 'habis'
=======
>>>>>>> origin/main
    };
    return statusMap[status] || 'tersedia';
  };

<<<<<<< HEAD
  const normalizeMenuData = (rawData: RawMenuItem[]): MenuItem[] => {
    return rawData.map((item) => ({
      id: item.id,
      nama: item.nama || '',
      harga: item.harga || '',
      deskripsi: item.deskripsi || '',
      status: normalizeStatus(item.status),
      foto: item.foto_url || (item.foto 
        ? `${API_URL}menu/${item.foto}`
        : `${API_URL}menu/placeholder-image.png`),
    }));
  };

  const fetchMenu = async (): Promise<void> => {
    console.log('Fetching menu data...');
    
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
=======
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
>>>>>>> origin/main
          Accept: 'application/json',
        },
      });

      console.log('Fetch response status:', res.status);

      if (!res.ok) {
<<<<<<< HEAD
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
      
=======
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

>>>>>>> origin/main
      if (response.status === 'success') {
        const normalizedData = normalizeMenuData(response.data || []);
        setMenu(normalizedData);
        console.log('Menu data updated, count:', normalizedData.length);
      } else {
        throw new Error(response.message || 'Failed to fetch menu');
      }
<<<<<<< HEAD
    } catch (error) {
      console.error('Fetch menu error:', error);
      throw error; // Re-throw untuk bisa di-catch di handleSubmit
    }
  };

  const searchMenu = async (query: string): Promise<void> => {
=======
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
>>>>>>> origin/main
    if (!query.trim()) {
      filterMenu();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
        headers: {
<<<<<<< HEAD
          Authorization: `Bearer ${token}`,
=======
          Authorization: `Bearer ${authToken}`,
>>>>>>> origin/main
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
<<<<<<< HEAD
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const response: ApiListResponse = await res.json();
      
      if (response.status === 'success') {
        const searchResults = normalizeMenuData(response.data || []);
        let filtered = searchResults;
        
=======
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

>>>>>>> origin/main
        if (statusFilter !== 'Semua') {
          filtered = filtered.filter((item: MenuItem) => item.status === statusFilter);
        }

        setFilteredMenu(filtered);
      } else {
        throw new Error(response.message || 'Gagal melakukan pencarian');
      }
<<<<<<< HEAD
    } catch (error) {
      console.error('Gagal search menu:', error);
      // Fallback ke filter lokal jika search API gagal
=======
    } catch (error: any) {
      console.error('Gagal search menu via API:', error);
      showNotification(`Gagal mencari menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
>>>>>>> origin/main
      filterMenu();
    } finally {
      setIsLoading(false);
    }
<<<<<<< HEAD
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
      
=======
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

>>>>>>> origin/main
      const formData = new FormData();
      formData.append('nama', form.nama.trim());
      formData.append('harga', form.harga.trim());
      formData.append('deskripsi', form.deskripsi.trim());
<<<<<<< HEAD
      formData.append('status', denormalizeStatus(form.status));

      // Append foto only if it's a File instance (meaning a new file was selected)
=======
      formData.append('jenis', form.jenis);
      formData.append('status', denormalizeStatus(form.status));

>>>>>>> origin/main
      if (form.foto instanceof File) {
        formData.append('foto', form.foto);
        console.log('Foto file appended to FormData:', form.foto.name, form.foto.size, form.foto.type);
      } else {
<<<<<<< HEAD
        console.log('No new file selected or form.foto is not a File instance. (Sending without "foto" field)');
        // Jika API backend Anda *membutuhkan* field foto, bahkan jika null,
        // Anda mungkin perlu menambahkan baris ini:
        // formData.append('foto', ''); // Atau formData.append('foto', 'null') jika API mengharapkan string 'null'
      }

      // Log the content of FormData
=======
        console.log('No new file selected or form.foto is not a File instance. (Not appending "foto" field)');
      }

>>>>>>> origin/main
      console.log('FormData contents before sending:');
      for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
      }
<<<<<<< HEAD
      // End Log FormData content

      let url = BASE_URL;
      let method = 'POST'; // Default method for both add and edit (Laravel often uses POST with _method for PUT)

      if (editId) {
        url = `${BASE_URL}/${editId}`;
        formData.append('_method', 'PUT'); // Add _method=PUT for update
=======

      let url = BASE_URL;
      let method = 'POST';

      if (editId) {
        url = `${BASE_URL}/${editId}`;
        formData.append('_method', 'PUT');
        method = 'POST';
>>>>>>> origin/main
        console.log('Submitting for EDIT. URL:', url, 'Method:', method, '_method:', 'PUT');
      } else {
        console.log('Submitting for ADD. URL:', url, 'Method:', method);
      }

      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: method,
        headers: {
<<<<<<< HEAD
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually.
          // The browser sets it automatically with the correct boundary when FormData is used as body.
=======
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
>>>>>>> origin/main
        },
        body: formData,
      });

      console.log('Response received, status:', response.status);

      if (!response.ok) {
        const errorResponseText = await response.text();
        console.error('Response not OK:', response.status, response.statusText);
        console.error('Server error response text:', errorResponseText);
<<<<<<< HEAD
        
=======

>>>>>>> origin/main
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

<<<<<<< HEAD
      let result;
=======
      let result: ApiSingleResponse;
>>>>>>> origin/main
      try {
        result = JSON.parse(responseText);
        console.log('Parsed API result:', result);
      } catch (parseError) {
        console.error('JSON parse error after successful fetch:', parseError);
        throw new Error('Invalid JSON response from server');
      }
<<<<<<< HEAD
      
=======

>>>>>>> origin/main
      if (result.status !== 'success') {
        console.error('API returned error status (even with 2xx HTTP code):', result);
        throw new Error(result.message || 'API returned error');
      }

      console.log('Submission successful! Closing modal...');

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
    } finally {
      setIsLoading(false);
      console.log('Submission process finished. isLoading set to false.');
    }
<<<<<<< HEAD
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteId) return;
=======
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
>>>>>>> origin/main

    setIsLoading(true);
    try {
      console.log('Initiating delete for menu ID:', deleteId);
<<<<<<< HEAD
      const response = await fetch(`${BASE_URL}/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
=======
      const deleteUrl = `${BASE_URL}/${deleteId}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
>>>>>>> origin/main
          Accept: 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
<<<<<<< HEAD
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
=======
        console.error('Delete response error text:', errorText);
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

>>>>>>> origin/main
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.message || errorMessage;
          console.error('Parsed delete error data:', errorData);
        } catch (parseError) {
          console.error('Failed to parse delete error response JSON:', parseError);
        }
<<<<<<< HEAD
        
=======

>>>>>>> origin/main
        throw new Error(errorMessage);
      }

      const result: ApiSingleResponse = await response.json();
      console.log('Delete API response:', result);
<<<<<<< HEAD
      
=======

>>>>>>> origin/main
      if (result.status !== 'success') {
        throw new Error(result.message || 'Gagal menghapus menu');
      }

<<<<<<< HEAD
      await fetchMenu();
      alert('Menu berhasil dihapus');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      console.error('Error deleting menu (Caught in handleDelete):', error);
      alert(`Gagal menghapus menu: ${errorMessage}`);
=======
      showNotification('Menu berhasil dihapus', 'success');
      console.log('Menu deleted successfully, refreshing data...');
      await fetchMenu();

    } catch (error: any) {
      console.error('Error deleting menu (Caught in handleDelete):', error);
      showNotification(`Gagal menghapus menu: ${error.message || 'Terjadi kesalahan tidak diketahui'}`, 'error');
>>>>>>> origin/main
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
      setDeleteId(null);
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
        setPreviewImage(null);
        console.log('File type is not an image.');
        return;
      }

      setForm(prev => ({ ...prev, foto: file }));

<<<<<<< HEAD
      // Create preview
=======
>>>>>>> origin/main
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        console.log('Image preview created.');
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, foto: '' }));
<<<<<<< HEAD
      // Only clear preview if not in edit mode (where an existing image might be shown)
      if (!editId) { 
=======
      if (!editId) {
>>>>>>> origin/main
        setPreviewImage(null);
      }
      console.log('No file selected. Foto state cleared.');
    }
<<<<<<< HEAD
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

=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
        disabled={isLoading}
=======
        disabled={isLoading || !authToken}
>>>>>>> origin/main
        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {isLoading ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Menu')}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto p-6">
        <MenuHeader onAddMenu={openAddModal} isLoading={isLoading} />
        
=======
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

>>>>>>> origin/main
        <MenuFilterSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
<<<<<<< HEAD
        />
        
=======
          disabled={!authToken}
        />

>>>>>>> origin/main
        <MenuTable
          menuItems={filteredMenu}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDeleteClick}
<<<<<<< HEAD
          BASE_URL={API_URL ?? ""}
        />

=======
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

>>>>>>> origin/main
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
<<<<<<< HEAD
=======
            disabled={!authToken}
>>>>>>> origin/main
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