// src/app/admin/manajemenUser/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TabNavigation from './components/TabNavigation';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import AddRestaurantModal from './components/AddRestaurantModal';
import EditUserModal from './components/UserEdit';

import { CgSpinner } from 'react-icons/cg';
import { UserPlus } from 'lucide-react';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

// Interfaces dari komponen yang Anda berikan
interface User {
  id: string;
  nama: string;
  email: string;
  peran: string; // 'pelanggan' atau 'pemilik_restoran' (asumsi: sesuai API Anda)
  no_hp: string;
  created_at: string;
  lokasi?: string; // NAMA FIELD DIGANTI DARI 'alamat' MENJADI 'lokasi'
  deskripsi?: string;
  nib?: string;
  nama_resto?: string;
  status?: string;
  kontak?: string;
}

// **UPDATED AddForm interface to match AddRestaurantModal.tsx**
type AddForm = {
  nama: string;
  email: string;
  no_hp: string;
  // ALAMAT DIGANTI DENGAN LOKASI
  lokasi: string; // NAMA FIELD DIGANTI DARI 'alamat' MENJADI 'lokasi'
  deskripsi: string;
  NIB: string;
  nama_resto: string;
  status: string;
  kontak: string;
  surat: File | null;
  kata_sandi: string;
};

interface EditForm {
  nama: string;
  email: string;
  no_hp: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'pelanggan' | 'pemilik'>('pelanggan');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<AddForm>({
    nama: '',
    email: '',
    no_hp: '',
    lokasi: '', // Menginisialisasi field 'lokasi'
    deskripsi: '',
    NIB: '',
    nama_resto: '',
    status: '',
    kontak: '',
    surat: null,
    kata_sandi: '',
  });
  const [addingUser, setAddingUser] = useState<boolean>(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    nama: '',
    email: '',
    no_hp: '',
  });
  const [editingUser, setEditingUser] = useState<boolean>(false);

  useEffect(() => {
    const retrieveToken = async () => {
      const storedToken = await getCookie('auth_token');
      if (typeof storedToken === 'string') {
        setAuthToken(storedToken);
      } else {
        console.log('No authentication token found. Redirecting to login.');
        setAuthToken(undefined);
      }
    };
    retrieveToken();
  }, []);

  const handleAuthError = useCallback(() => {
    setError('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
    deleteCookie('auth_token');
    router.push('/login');
  }, [router]);

  const fetchUsers = useCallback(async () => {
    if (authToken === undefined) {
      return;
    }
    if (!authToken) {
      setLoading(false);
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      if (activeTab === 'pelanggan') {
        endpoint = `${API_BASE_URL}/customers`;
      } else {
        endpoint = `${API_BASE_URL}/users`;
      }

      console.log('Fetching users from:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil data ${activeTab}: ${response.status}`);
      }

      const result = await response.json();
      let fetchedData: User[] = [];
      let totalFetchedUsers: number = 0;

      if (Array.isArray(result.data)) {
        fetchedData = result.data;
        totalFetchedUsers = result.data.length;
      } else if (result.data && Array.isArray(result.data.data)) {
        fetchedData = result.data.data;
        totalFetchedUsers = result.data.total || fetchedData.length;
      }

      setUsers(fetchedData);
      setTotalUsers(totalFetchedUsers);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui saat mengambil data.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, authToken, handleAuthError]);

  useEffect(() => {
    if (authToken !== undefined) {
      fetchUsers();
    }
  }, [fetchUsers, authToken]);

  const handleTabChange = (tab: 'pelanggan' | 'pemilik') => {
    setActiveTab(tab);
    setUsers([]);
    setTotalUsers(0);
  };

  // --- Handler untuk Menambah Pengguna (Pemilik Restoran) ---
  const handleOpenAddModal = () => {
    setAddForm({
      nama: '',
      email: '',
      no_hp: '',
      lokasi: '', // Menginisialisasi field 'lokasi'
      deskripsi: '',
      NIB: '',
      nama_resto: '',
      status: '',
      kontak: '',
      surat: null,
      kata_sandi: '',
    });
    setIsAddModalOpen(true);
  };

  const handleAddFormChange = (form: AddForm) => {
    setAddForm(form);
  };

  const handleAddSubmit = async () => {
    console.log('Starting add submit with form data:', {
      ...addForm,
      surat: addForm.surat ? { name: addForm.surat.name, size: addForm.surat.size } : null
    });

    if (!authToken) {
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setAddingUser(true);
    setError(null);

    const requiredFields = [
      { field: addForm.nama, name: 'Nama' },
      { field: addForm.email, name: 'Email' },
      { field: addForm.no_hp, name: 'No HP' },
      { field: addForm.nama_resto, name: 'Nama Resto' },
      { field: addForm.NIB, name: 'NIB' },
      { field: addForm.status, name: 'Status' },
      { field: addForm.kontak, name: 'Kontak' },
      { field: addForm.kata_sandi, name: 'Kata Sandi' },
      { field: addForm.surat, name: 'Surat' }
    ];
    
    // TAMBAHKAN LOKASI KE VALIDASI REQUIRED JIKA WAJIB DI BACKEND
    // Jika lokasi wajib, tambahkan: { field: addForm.lokasi, name: 'Lokasi' },

    const missingFields = requiredFields.filter(({ field }) => !field).map(({ name }) => name);

    if (missingFields.length > 0) {
      setError(`Field berikut wajib diisi: ${missingFields.join(', ')}`);
      setAddingUser(false);
      return;
    }

    if (addForm.surat && addForm.surat.size > 5 * 1024 * 1024) {
      setError('Ukuran file surat tidak boleh lebih dari 5MB');
      setAddingUser(false);
      return;
    }

    const formData = new FormData();
    formData.append('nama', addForm.nama);
    formData.append('email', addForm.email);
    formData.append('no_hp', addForm.no_hp);
    formData.append('lokasi', addForm.lokasi || ''); // MENGIRIM addForm.lokasi KE FIELD 'lokasi' DI BACKEND
    formData.append('deskripsi', addForm.deskripsi || '');
    formData.append('nib', addForm.NIB); // MENGIRIM NIB KE FIELD 'nib' DI BACKEND
    formData.append('nama_resto', addForm.nama_resto);
    formData.append('status', addForm.status);
    formData.append('kontak', addForm.kontak);
    formData.append('kata_sandi', addForm.kata_sandi);
    if (addForm.surat) {
      formData.append('surat', addForm.surat);
    }

    try {
      const endpoint = `${API_BASE_URL}/users`;
      console.log('Sending POST request to:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          throw new Error(errorMessages);
        } else {
          throw new Error(responseData.message || `Gagal menambah pemilik restoran: ${response.status}`);
        }
      }

      console.log('User added successfully:', responseData);
      setIsAddModalOpen(false);
      await fetchUsers();
      
      setError(null);
      
    } catch (err) {
      console.error('Add user error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menambah pengguna.');
    } finally {
      setAddingUser(false);
    }
  };

  // --- Handler untuk Mengedit Pengguna ---
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      nama: user.nama,
      email: user.email,
      no_hp: user.no_hp,
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (form: EditForm) => {
    setEditForm(form);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;
    if (!authToken) {
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setEditingUser(true);
    setError(null);

    try {
      let endpoint = '';
      let method = 'PUT';
      let bodyData: any = {
        nama: editForm.nama,
        email: editForm.email,
        no_hp: editForm.no_hp,
      };

      if (activeTab === 'pelanggan') {
        endpoint = `${API_BASE_URL}/customers/${selectedUser.id}`;
      } else { // 'pemilik'
        endpoint = `${API_BASE_URL}/users/${selectedUser.id}`;
        // Jika ada field lokasi di User untuk edit, Anda juga perlu menambahkannya di sini
        // bodyData.lokasi = selectedUser.lokasi; // Contoh
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join('. ');
          throw new Error(errorMessages || `Gagal mengedit ${activeTab}: ${response.status}`);
        } else {
          throw new Error(errorData.message || `Gagal mengedit ${activeTab}: ${response.status}`);
        }
      }

      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Edit user error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengedit pengguna.');
    } finally {
      setEditingUser(false);
    }
  };

  // --- Handler untuk Menghapus Pengguna ---
  const handleDelete = async (user: User) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${user.nama}?`)) {
      return;
    }
    if (!authToken) {
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      if (activeTab === 'pelanggan') {
        endpoint = `${API_BASE_URL}/customers/${user.id}`;
      } else { // 'pemilik'
        endpoint = `${API_BASE_URL}/users/${user.id}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal menghapus ${activeTab}: ${response.status}`);
      }

      fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus pengguna.');
    } finally {
      setLoading(false);
    }
  };

  if (authToken === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
          <span>Memuat sesi pengguna...</span>
        </div>
      </div>
    );
  }

  if (!authToken) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center text-red-600">
        <p className="text-lg font-semibold mb-4">Anda belum login atau sesi telah berakhir.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-[#6A1B1A] hover:bg-[#8B2C2B] text-white text-md px-6 py-3 rounded-lg transition-colors duration-200 shadow-md"
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2 whitespace-pre-line">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg onClick={() => setError(null)} className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.414l-2.651 2.651a1.2 1.2 0 1 1-1.697-1.697L8.586 10 5.935 7.349a1.2 1.2 0 1 1 1.697-1.697L10 8.586l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.414 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'pelanggan' ? 'Data Pelanggan' : 'Data Pemilik Restoran'}
            </h2>
            {activeTab === 'pemilik' && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
              >
                <UserPlus size={16} />
                Tambah Pemilik Restoran
              </button>
            )}
          </div>

          <UserTable
            users={users}
            loading={loading}
            activeTab={activeTab}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination activeTab={activeTab} totalUsers={totalUsers} />
        </div>
      </div>

      {/* Modals */}
      <AddRestaurantModal
        isOpen={isAddModalOpen}
        addForm={addForm}
        loading={addingUser}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        onFormChange={handleAddFormChange}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        editForm={editForm}
        loading={editingUser}
        activeTab={activeTab}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        onFormChange={handleEditFormChange}
      />
    </div>
  );
}