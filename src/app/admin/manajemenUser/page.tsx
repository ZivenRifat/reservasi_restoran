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

// Interfaces dari komponen yang Anda berikan
interface User {
  id: string;
  nama: string;
  email: string;
  peran: string; // 'pelanggan' atau 'pemilik_restoran' (asumsi: sesuai API Anda)
  no_hp: string;
  created_at: string;
  // Tambahan properti untuk pemilik restoran jika API GET show penyedia mengembalikan ini,
  // atau jika Anda ingin menampilkannya di tabel/modal edit.
  alamat?: string;
  deskripsi?: string;
  nib?: string;
  nama_resto?: string; 
  lokasi?: string;     
  status?: string;    
  kontak?: string;     
}

interface AddForm {
  nama: string;
  email: string;
  no_hp: string;
  alamat: string;
  deskripsi: string;
  nib: string;
  nama_resto: string; // Diperbarui dari nama_restoran
  lokasi: string;
  status: string; // Akan disesuaikan dengan "buka" atau "tutup"
  kontak: string;
  surat: File | null;
  kata_sandi: string;
}

interface EditForm {
  nama: string;
  email: string;
  no_hp: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';
const AUTH_TOKEN = 'YCXYVZHkCUCc9xNZsOU19q5FqxfQ8oKA3bHLhAoR1e10ab98'; // Ganti dengan token Anda yang sebenarnya

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'pelanggan' | 'pemilik'>('pelanggan');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0); // Untuk pagination

  // State untuk modal tambah pengguna
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<AddForm>({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    deskripsi: '',
    nib: '',
    nama_resto: '',
    lokasi: '',
    status: '', // Inisialisasi status
    kontak: '',
    surat: null,
    kata_sandi: '',
  });
  const [addingUser, setAddingUser] = useState<boolean>(false); // Loading state untuk proses tambah

  // State untuk modal edit pengguna
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    nama: '',
    email: '',
    no_hp: '',
  });
  const [editingUser, setEditingUser] = useState<boolean>(false); // Loading state untuk proses edit

  // Fetch users berdasarkan tab aktif
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      if (activeTab === 'pelanggan') {
        // Endpoint GET all customers
        endpoint = `${API_BASE_URL}/customers`;
      } else { // 'pemilik'
        // Endpoint GET all users (penyedia)
        endpoint = `${API_BASE_URL}/users`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Sesi telah berakhir. Silakan login kembali.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil data ${activeTab}: ${response.status}`);
      }

      const result = await response.json();
      // Mengakses data array yang sebenarnya (misal: result.data.data jika bersarang, atau result.data jika langsung array)
      let fetchedData: User[] = [];
      let totalFetchedUsers: number = 0;

      // Cek apakah 'result.data' adalah array (seperti untuk penyedia)
      if (Array.isArray(result.data)) {
        fetchedData = result.data;
        totalFetchedUsers = result.data.length; // Jika tidak ada 'total' dari API, gunakan panjang array
      }
      // Atau apakah 'result.data' adalah objek dengan 'data' di dalamnya (seperti untuk restoran/pelanggan ber-pagination)
      else if (result.data && Array.isArray(result.data.data)) {
        fetchedData = result.data.data;
        totalFetchedUsers = result.data.total || fetchedData.length;
      }

      setUsers(fetchedData);
      setTotalUsers(totalFetchedUsers); // Set total users untuk pagination
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui saat mengambil data.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handler untuk mengubah tab
  const handleTabChange = (tab: 'pelanggan' | 'pemilik') => {
    setActiveTab(tab);
    setUsers([]); // Reset users saat ganti tab
    setTotalUsers(0); // Reset total saat ganti tab
  };

  // --- Handler untuk Menambah Pengguna (Pemilik Restoran) ---
  const handleOpenAddModal = () => {
    setAddForm({
      nama: '',
      email: '',
      no_hp: '',
      alamat: '',
      deskripsi: '',
      nib: '',
      nama_resto: '',
      lokasi: '',
      status: '', // Reset status
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
    setAddingUser(true);
    setError(null);

    // Validasi sederhana: pastikan semua field yang diperlukan ada
    if (
      !addForm.nama ||
      !addForm.email ||
      !addForm.no_hp ||
      !addForm.nama_resto ||
      !addForm.lokasi ||
      !addForm.status ||
      !addForm.kontak ||
      !addForm.surat ||
      !addForm.kata_sandi
    ) {
      setError('Semua kolom wajib diisi: Nama, Email, No HP, Nama Resto, Lokasi, Status, Kontak, Surat, dan Kata Sandi.');
      setAddingUser(false);
      return;
    }

    const formData = new FormData();
    formData.append('nama', addForm.nama);
    formData.append('email', addForm.email);
    formData.append('no_hp', addForm.no_hp);
    formData.append('alamat', addForm.alamat);
    formData.append('deskripsi', addForm.deskripsi);
    formData.append('nib', addForm.nib);
    formData.append('nama_resto', addForm.nama_resto);
    formData.append('lokasi', addForm.lokasi);
    formData.append('status', addForm.status);
    formData.append('kontak', addForm.kontak);
    formData.append('kata_sandi', addForm.kata_sandi);
    if (addForm.surat) {
      formData.append('surat', addForm.surat);
    }

    try {
      // Endpoint POST tambah user restoran
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Menangani error dari server yang bisa berisi banyak pesan
        if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat().join('. ');
            throw new Error(errorMessages || `Gagal menambah pemilik restoran: ${response.status}`);
        } else {
            throw new Error(errorData.message || `Gagal menambah pemilik restoran: ${response.status}`);
        }
      }

      // Jika berhasil, tutup modal dan refresh data
      setIsAddModalOpen(false);
      fetchUsers();
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

    setEditingUser(true);
    setError(null);

    try {
      let endpoint = '';
      let method = 'PUT'; // Atau PATCH, tergantung API Anda
      let bodyData: any = {
        nama: editForm.nama,
        email: editForm.email,
        no_hp: editForm.no_hp,
      };

      if (activeTab === 'pelanggan') {
        // Endpoint PUT update customer
        endpoint = `${API_BASE_URL}/customers/${selectedUser.id}`;
      } else { // 'pemilik'
        // Endpoint PUT update penyedia
        endpoint = `${API_BASE_URL}/users/${selectedUser.id}`;
        // Jika ada properti tambahan untuk pemilik, tambahkan di sini untuk update
        // bodyData.alamat = selectedUser.alamat;
        // bodyData.deskripsi = selectedUser.deskripsi;
        // bodyData.nib = selectedUser.nib;
        // bodyData.nama_resto = selectedUser.nama_resto;
        // bodyData.lokasi = selectedUser.lokasi;
        // bodyData.status = selectedUser.status;
        // bodyData.kontak = selectedUser.kontak;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Menangani error dari server yang bisa berisi banyak pesan
        if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat().join('. ');
            throw new Error(errorMessages || `Gagal mengedit ${activeTab}: ${response.status}`);
        } else {
            throw new Error(errorData.message || `Gagal mengedit ${activeTab}: ${response.status}`);
        }
      }

      setIsEditModalOpen(false);
      fetchUsers(); // Refresh data setelah edit
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

    setLoading(true); // Atau gunakan state loading terpisah untuk delete
    setError(null);

    try {
      let endpoint = '';
      if (activeTab === 'pelanggan') {
        // Endpoint DELETE customer
        endpoint = `${API_BASE_URL}/customers/${user.id}`;
      } else { // 'pemilik'
        // Endpoint DELETE penyedia
        endpoint = `${API_BASE_URL}/users/${user.id}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal menghapus ${activeTab}: ${response.status}`);
      }

      // Jika berhasil, refresh data
      fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus pengguna.');
    } finally {
      setLoading(false);
    }
  };

  // --- Placeholder untuk Delete Foto Tambahan (Jika diperlukan di masa mendatang) ---
  // Endpoint: DELETE FOTO tambahan {{url}}/api/admin/users/foto-tambahan/5cbbb5d6-53ae-4cfe-b637-cdd8d95e96c5
  // Jika Anda ingin mengimplementasikan fungsi ini di masa mendatang,
  // Anda bisa menambahkannya ke UserTable atau di tempat yang relevan.
  // const handleDeleteFotoTambahan = async (fotoId: string) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/users/foto-tambahan/${fotoId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${AUTH_TOKEN}`,
  //         'Accept': 'application/json',
  //       },
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || `Gagal menghapus foto tambahan: ${response.status}`);
  //     }
  //     console.log(`Foto tambahan dengan ID ${fotoId} berhasil dihapus.`);
  //     // Mungkin perlu refresh data atau update UI lokal
  //   } catch (err) {
  //     console.error('Error deleting additional photo:', err);
  //     setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus foto tambahan.');
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
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
            {activeTab === 'pemilik' && ( // Tombol tambah hanya untuk pemilik restoran
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