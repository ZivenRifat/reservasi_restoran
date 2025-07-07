// FILE: TableList.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Upload, Edit, Trash2, X, Check, AlertCircle, MapPin, Users } from 'lucide-react';
import TableLayout from "./TableLayout";
import { getCookie, deleteCookie } from 'cookies-next';

// Definisi Tipe Data
interface Meja {
  api_id: string;
  nomor_kursi: number;
  jumlah: number;
  status: 'Kosong' | 'Digunakan';
  lokasi: 'Didalam' | 'Diluar';
}

interface FormDataState {
  nomor_kursi: string;
  jumlah: string;
  status: 'Kosong' | 'Digunakan';
  lokasi: 'Didalam' | 'Diluar';
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

export default function TableList() {
  // --- API Configuration ---
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  // UBAH: Menambahkan `| null` ke tipe authToken untuk mengakomodasi nilai null
  const [authToken, setAuthToken] = useState<string | null | undefined>(undefined);

  // --- State Variables ---
  const [mejaList, setMejaList] = useState<Meja[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [editData, setEditData] = useState<Meja | null>(null);
  const [form, setForm] = useState<FormDataState>({ nomor_kursi: '', jumlah: '', status: 'Kosong', lokasi: 'Didalam' });
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false); // Separate loading state for upload
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDenahUrl, setUploadedDenahUrl] = useState<string | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000); // Extend notification time
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    if (uploadLoading) {
      showNotification('Upload sedang berlangsung, mohon tunggu...', 'error');
      return;
    }
    fileInputRef.current?.click();
  };

  // --- File Validation Function ---
  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type - synced with Laravel backend mimes: png,jpg,jpeg,gif,webp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        message: 'Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.' 
      };
    }

    // Check file size (max 5MB) - synced with Laravel backend max:5120 (KB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { 
        valid: false, 
        message: 'Ukuran file terlalu besar. Maksimal 5MB.' 
      };
    }

    return { valid: true };
  };

  // --- Fetch Token ---
  const retrieveAuthToken = useCallback(() => {
    const token = getCookie('auth_token'); // getCookie is synchronous
    if (typeof token === 'string') {
      setAuthToken(token);
    } else {
      // Perbaikan: setAuthToken(null) karena tipe sudah mencakup null
      setAuthToken(null); // Set to null if not found or not a string, indicating checked and absent
      showNotification('Sesi berakhir atau tidak valid. Mohon login ulang.', 'error');
    }
  }, [showNotification]);

  // --- Fetch Meja List ---
  const fetchMejaList = useCallback(async () => {
    // Only proceed if authToken has been explicitly checked (not undefined initial state)
    if (authToken === undefined) { 
      setLoading(true); // Keep loading true until token is retrieved
      return;
    }
    if (!authToken) { // Token is null or empty string, no auth
      showNotification('Autentikasi diperlukan untuk melihat data meja.', 'error');
      setMejaList([]);
      setUploadedDenahUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        showNotification('Sesi Anda telah berakhir. Mohon login ulang.', 'error');
        deleteCookie('auth_token');
        // Perbaikan: setAuthToken(null) karena tipe sudah mencakup null
        setAuthToken(null); // Set to null after deleting cookie
        return; // Let finally block set loading false
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.data) {
        const tablesArray = Array.isArray(result.data.tables) ? result.data.tables : [];

        const mappedMejaList: Meja[] = tablesArray.map((item: any) => ({
          api_id: item.id,
          nomor_kursi: item.nomor_kursi,
          jumlah: item.kapasitas,
          status: item.status === 'tersedia' ? 'Kosong' : 'Digunakan',
          lokasi: item.posisi === 'didalam' ? 'Didalam' : 'Diluar',
        }));
        setMejaList(mappedMejaList);

        // Update denah URL from fetched data (using result.data.denah_meja.url)
        if (result.data.denah_meja && result.data.denah_meja.url) {
          setUploadedDenahUrl(result.data.denah_meja.url);
        } else {
          setUploadedDenahUrl(null);
        }
      } else {
        throw new Error(result.message || 'Struktur data tidak sesuai atau tidak ada data.');
      }
    } catch (error: any) {
      console.error('Error fetching meja list:', error);
      showNotification(`Error memuat meja: ${error.message}`, 'error');
      setMejaList([]);
      setUploadedDenahUrl(null);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, authToken, showNotification]);

  // --- Handle Submit (Meja Add/Edit) ---
  const handleSubmit = async () => {
    if (!authToken) {
      showNotification('Autentikasi diperlukan. Mohon login ulang.', 'error');
      return;
    }
    if (!form.nomor_kursi || !form.jumlah) {
      showNotification('Mohon lengkapi semua field', 'error');
      return;
    }

    setLoading(true);
    const mejaPayload: {
      id?: string;
      nomor_kursi: number;
      kapasitas: number;
      posisi: string;
      status: string;
    } = {
      nomor_kursi: parseInt(form.nomor_kursi),
      kapasitas: parseInt(form.jumlah),
      posisi: form.lokasi.toLowerCase(),
      status: form.status.toLowerCase() === 'kosong' ? 'tersedia' : 'dipesan', // Sesuaikan dengan 'dipesan' di backend
    };

    let apiEndpoint = `${BASE_URL}/api/penyedia/kursi`;
    let method = 'POST';

    if (editData) {
      mejaPayload.id = editData.api_id;
      method = 'POST';
      apiEndpoint = `${BASE_URL}/api/penyedia/kursi/${editData.api_id}`;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mejaPayload),
      });

      if (response.status === 401) {
        showNotification('Sesi Anda telah berakhir. Mohon login ulang.', 'error');
        deleteCookie('auth_token');
        // Perbaikan: setAuthToken(null) karena tipe sudah mencakup null
        setAuthToken(null);
        return; // Let finally block set loading false
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Gagal ${editData ? 'memperbarui' : 'menambah'} meja`);
      }

      await response.json(); // Consume response body
      showNotification(`Meja berhasil ${editData ? 'diperbarui' : 'ditambahkan'}`);
      setShowModal(false);
      fetchMejaList(); // Refresh list to see changes
    } catch (error: any) {
      console.error('Error submitting meja:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Enhanced Upload Handler ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      showNotification('Pilih file denah terlebih dahulu', 'error');
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      showNotification(validation.message!, 'error');
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (!authToken) {
      showNotification('Autentikasi diperlukan. Mohon login ulang.', 'error');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    // PENTING: Gunakan 'denah_meja' agar cocok dengan yang diharapkan backend Laravel Anda
    formData.append('denah_meja', file); 

    // Show initial upload notification
    showNotification(`Mengunggah denah "${file.name}"...`, 'success');

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi/upload-denah`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // Jangan set Content-Type untuk FormData - biarkan browser yang mengatur dengan boundary
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (response.status === 401) {
        showNotification('Sesi Anda telah berakhir. Mohon login ulang.', 'error');
        deleteCookie('auth_token');
        // Perbaikan: setAuthToken(null) karena tipe sudah mencakup null
        setAuthToken(null);
        return; // Let finally block set uploadLoading false
      }

      // Selalu coba baca respons sebagai teks terlebih dahulu untuk debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Server mengembalikan respons yang tidak valid. Status: ${response.status}. Respons: ${responseText}`);
      }

      if (!response.ok) {
        console.error('API Error Response:', result);
        // Menampilkan pesan error spesifik dari backend jika ada
        throw new Error(result.message || `Gagal mengunggah denah. Status: ${response.status} - ${response.statusText}`);
      }

      // Handle successful response
      if (result.status === "success") {
        // Backend mengembalikan 'url' di 'data'
        if (result.data && result.data.url) { 
          setUploadedDenahUrl(result.data.url);
          showNotification('Denah berhasil diunggah dan diperbarui!');
        } else {
          // Jika backend tidak mengembalikan URL dalam respons upload,
          // panggil fetchMejaList untuk mendapatkan URL denah terbaru.
          showNotification('Denah berhasil diunggah. Memuat ulang data...');
          fetchMejaList(); 
        }
      } else {
        throw new Error(result.message || 'Upload berhasil tetapi struktur respons tidak sesuai.');
      }

    } catch (error: any) {
      console.error('Error uploading denah:', error);
      showNotification(`Gagal mengunggah denah: ${error.message}`, 'error');
    } finally {
      setUploadLoading(false);
      // Selalu kosongkan input file setelah percobaan upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // --- Handle Delete (Meja) ---
  const handleDelete = async () => {
    if (!selectedMeja) return;
    if (!authToken) {
      showNotification('Autentikasi diperlukan. Mohon login ulang.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi/${selectedMeja.api_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        showNotification('Sesi Anda telah berakhir. Mohon login ulang.', 'error');
        deleteCookie('auth_token');
        // Perbaikan: setAuthToken(null) karena tipe sudah mencakup null
        setAuthToken(null);
        return; // Let finally block set loading false
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghapus meja');
      }

      showNotification('Meja berhasil dihapus');
      setShowDeleteConfirm(false);
      fetchMejaList(); // Refresh list to remove deleted item
    } catch (error: any) {
      console.error('Error deleting meja:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Control Functions ---
  const openAddModal = () => {
    setForm({ nomor_kursi: '', jumlah: '', status: 'Kosong', lokasi: 'Didalam' });
    setEditData(null);
    setShowModal(true);
  };

  const openEditModal = (meja: Meja) => {
    setForm({
      nomor_kursi: meja.nomor_kursi.toString(),
      jumlah: meja.jumlah.toString(),
      status: meja.status,
      lokasi: meja.lokasi
    });
    setEditData(meja);
    setShowModal(true);
  };

  const openDeleteConfirm = (meja: Meja) => {
    setSelectedMeja(meja);
    setShowDeleteConfirm(true);
  };

  // --- useEffect Hooks ---
  useEffect(() => {
    retrieveAuthToken();
  }, [retrieveAuthToken]);

  useEffect(() => {
    // Fetch meja list only if authToken has been explicitly checked (not undefined)
    // and authToken is not null (meaning token exists)
    if (authToken !== undefined) { 
      fetchMejaList();
    }
  }, [fetchMejaList, authToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-inter">
      {/* Notification */}
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

      <div className="max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              className="flex items-center gap-2 bg-[#A32A2A] hover:bg-[#8e2525] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={openAddModal}
              disabled={loading || authToken === null}
            >
              <Plus size={20} />
              Tambah Meja Baru
            </button>

            <button
              className={`flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                uploadLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-[#A32A2A] hover:bg-[#8e2525]'
              }`}
              onClick={handleUploadClick}
              // Disabled jika sedang loading utama, authToken tidak ada/null, atau sedang upload
              disabled={loading || authToken === null || uploadLoading} 
            >
              <Upload size={20} className={uploadLoading ? 'animate-spin' : ''} />
              {uploadLoading ? 'Mengunggah...' : 'Unggah Denah'}
            </button>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
              disabled={loading || authToken === null || uploadLoading} // Disabled jika loading utama, authToken tidak ada/null, atau sedang upload
            />
          </div>

          {/* Upload Status Info */}
          {uploadedDenahUrl && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Check size={16} />
                <span className="text-sm font-medium">Denah aktif tersedia</span>
                {/* Opsional: Tampilkan URL denah untuk debugging */}
                {/* <a href={uploadedDenahUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">Lihat Denah</a> */}
              </div>
            </div>
          )}
          {!uploadedDenahUrl && !loading && authToken !== null && ( // Show this if no denah URL AND not loading AND authToken exists
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Belum ada denah diunggah. Silakan unggah denah.</span>
              </div>
            </div>
          )}
        </div>

        {/* Table Layout Component */}
        <div className="mb-8">
          <TableLayout uploadedDenahUrl={uploadedDenahUrl} />
        </div>

        {/* Table List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Meja</h2>
          </div>

          <div className="overflow-x-auto">
            {loading && mejaList.length === 0 ? ( // Added check for mejaList.length for better UX
                <div className="p-6 text-center text-gray-500">Memuat daftar meja...</div>
            ) : authToken === null ? ( // Show message if token is explicitly null
                <div className="p-6 text-center text-red-500 font-semibold">Token autentikasi tidak ditemukan. Mohon login untuk melihat data meja.</div>
            ) : mejaList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Tidak ada data meja. Tambahkan meja baru.</div>
            ) : (
                <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Kode Meja</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Kapasitas</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Lokasi</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {mejaList.map((meja) => (
                    <tr key={meja.api_id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{meja.nomor_kursi}</span>
                            </div>
                            <span className="font-medium text-gray-800">Meja {meja.nomor_kursi}</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            <span className="text-gray-700">{meja.jumlah} orang</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            meja.status === 'Kosong'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {meja.status === 'Kosong' ? '● Tersedia' : '● Terpakai'}
                        </span>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-700">{meja.lokasi}</span>
                        </div>
                        </td>
                        <td className="p-4">
                        <div className="flex gap-2">
                            
                            
                            <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => openDeleteConfirm(meja)}
                            title="Hapus meja"
                            disabled={loading || authToken === null}
                            >
                            <Trash2 size={18} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editData ? 'Edit Meja' : 'Tambah Meja Baru'}
                  </h3>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Meja
                    </label>
                    <input
                      name="nomor_kursi"
                      type="number"
                      value={form.nomor_kursi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Masukkan nomor meja"
                      disabled={!!editData || loading || authToken === null}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kapasitas Kursi
                    </label>
                    <input
                      name="jumlah"
                      type="number"
                      value={form.jumlah}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Jumlah kursi"
                      disabled={loading || authToken === null}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status Meja
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={loading || authToken === null}
                    >
                      <option value="Kosong">Tersedia</option>
                      <option value="Digunakan">Terpakai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lokasi Meja
                    </label>
                    <select
                      name="lokasi"
                      value={form.lokasi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={loading || authToken === null}
                    >
                      <option value="Didalam">Di dalam ruangan</option>
                      <option value="Diluar">Di luar ruangan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  className="px-6 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading || authToken === null}
                >
                  {loading ? 'Menyimpan...' : (editData ? 'Perbarui' : 'Simpan')}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus <strong>Meja {selectedMeja?.nomor_kursi}</strong>?
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    className="px-6 py-3 border border-slate-300 text-gray-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={loading || authToken === null} // Disabled jika loading atau token null
                  >
                    {loading ? 'Menghapus...' : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}