// src/app/Restoran/manajemenMeja/components/TableList.tsx

import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Upload, Edit, Trash2, X, Check, AlertCircle, MapPin, Users } from 'lucide-react';
import TableLayout from "./TableLayout"; // Import TableLayout

// Definisi Tipe Data (pastikan sama seperti yang sudah Anda miliki)
interface Meja {
  api_id: string; // ID unik dari API (UUID)
  nomor_kursi: number; // Nomor meja yang ditampilkan ke pengguna
  jumlah: number; // Kapasitas kursi
  status: 'Kosong' | 'Digunakan'; // Status meja (sesuai tampilan UI)
  lokasi: 'Didalam' | 'Diluar'; // Lokasi meja (sesuai tampilan UI)
}

interface FormDataState {
  nomor_kursi: string; // Input untuk nomor meja
  jumlah: string;
  status: 'Kosong' | 'Digunakan';
  lokasi: 'Didalam' | 'Diluar';
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

export default function TableList() { // Ubah nama fungsi menjadi TableList
  // --- Konfigurasi API ---
  const BASE_URL = 'http://127.0.0.1:8000';
  const AUTH_TOKEN = 'htojmxT3qwtSICLNEvIWk5hf1SWaJWROVwVU3Ecj1545d888'; 

  // --- State Variables ---
  const [mejaList, setMejaList] = useState<Meja[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [editData, setEditData] = useState<Meja | null>(null);
  const [form, setForm] = useState<FormDataState>({ nomor_kursi: '', jumlah: '', status: 'Kosong', lokasi: 'Didalam' });
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDenahUrl, setUploadedDenahUrl] = useState<string | null>(null); 

  // --- Fungsi Utilitas ---
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- Fungsi Panggilan API ---

  const fetchMejaList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil daftar meja');
      }
      const result = await response.json();
      
      if (result.status === "success" && Array.isArray(result.data)) {
        const mappedMejaList: Meja[] = result.data.map((item: any) => ({
          api_id: item.id,
          nomor_kursi: item.nomor_kursi,
          jumlah: item.kapasitas,
          status: item.status === 'tersedia' ? 'Kosong' : 'Digunakan',
          lokasi: item.posisi === 'didalam' ? 'Didalam' : 'Diluar',
        }));
        setMejaList(mappedMejaList);
      } else {
        throw new Error(result.message || 'Struktur data tidak sesuai');
      }
    } catch (error: any) {
      console.error('Error fetching meja list:', error);
      showNotification(`Error: ${error.message}`, 'error');
      setMejaList([]); 
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, AUTH_TOKEN]); 

  const fetchActiveDenah = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi/denah`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Tidak ada denah aktif ditemukan atau error saat mengambil denah.');
        setUploadedDenahUrl(null);
        return; 
      }
      
      const result = await response.json();
      if (result.status === "success" && result.data && result.data.url) {
        setUploadedDenahUrl(result.data.url);
      } else {
        setUploadedDenahUrl(null);
        console.warn('Respons fetchActiveDenah tidak mengandung URL denah yang valid:', result);
      }
    } catch (error: any) {
      console.error('Error fetching active denah:', error);
      setUploadedDenahUrl(null);
    }
  }, [BASE_URL, AUTH_TOKEN]);

  const handleSubmit = async () => {
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
      status: form.status.toLowerCase() === 'kosong' ? 'tersedia' : 'digunakan',
    };

    if (editData) {
      mejaPayload.id = editData.api_id;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mejaPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal ${editData ? 'memperbarui' : 'menambah'} meja`);
      }

      await response.json();
      showNotification(`Meja berhasil ${editData ? 'diperbarui' : 'ditambahkan'}`);
      setShowModal(false);
      fetchMejaList(); 
    } catch (error: any) {
      console.error('Error submitting meja:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      showNotification('Pilih file denah terlebih dahulu', 'error');
      return;
    }

    console.log('File yang akan diunggah:', file);
    console.log('Nama file:', file.name);
    console.log('Tipe file:', file.type);
    console.log('Ukuran file:', file.size, 'bytes');

    setLoading(true);
    const formData = new FormData();
    formData.append('denah', file);

    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi/upload-denah`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData); 
        throw new Error(errorData.message || `Gagal mengunggah denah. Status: ${response.status}.`);
      }

      const result = await response.json();
      if (result.status === "success" && result.data && result.data.url) {
        setUploadedDenahUrl(result.data.url);
        showNotification('Denah berhasil diunggah');
        fetchActiveDenah(); 
      } else {
        throw new Error(result.message || 'Unggah denah berhasil, tetapi URL denah tidak ditemukan dalam respons data.');
      }
    } catch (error: any) {
      console.error('Error uploading denah:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedMeja) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/penyedia/kursi/${selectedMeja.api_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus meja');
      }

      showNotification('Meja berhasil dihapus');
      setShowDeleteConfirm(false);
      fetchMejaList(); 
    } catch (error: any) {
      console.error('Error deleting meja:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect Hooks ---
  useEffect(() => {
    fetchMejaList(); 
    fetchActiveDenah(); 
  }, [fetchMejaList, fetchActiveDenah]); 

  // --- Fungsi Kontrol Modal ---
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 font-inter">
      {/* Notifikasi */}
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
        
        {/* Tombol Aksi */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button 
              className="flex items-center gap-2 bg-[#A32A2A] hover:bg-[#8e2525] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={openAddModal}
            >
              <Plus size={20} />
              Tambah Meja Baru
            </button>
            
            <button 
              className="flex items-center gap-2 bg-[#A32A2A] hover:bg-[#8e2525] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUploadClick}
              disabled={loading}
            >
              <Upload size={20} />
              {loading ? 'Mengunggah Denah...' : 'Unggah Denah'}
            </button>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
              disabled={loading}
            />
          </div>
        </div>

        {/* Memanggil TableLayout dan meneruskan uploadedDenahUrl */}
        <div className="mb-8">
          <TableLayout uploadedDenahUrl={uploadedDenahUrl} />
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Meja</h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading && mejaList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Memuat daftar meja...</div>
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => openEditModal(meja)}
                            title="Edit meja"
                            disabled={loading}
                            >
                            <Edit size={18} />
                            </button>
                            <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => openDeleteConfirm(meja)}
                            title="Hapus meja"
                            disabled={loading}
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

        {/* Modal Tambah/Edit */}
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
                      disabled={!!editData || loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : (editData ? 'Perbarui' : 'Simpan')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
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
                    disabled={loading}
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