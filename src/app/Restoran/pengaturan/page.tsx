'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Untuk navigasi atau refresh
import React from 'react'; // Import React karena menggunakan React.ChangeEvent/FormEvent

export default function PengaturanPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    nama_restoran: '',
    lokasi: '', // Menggunakan 'lokasi' untuk Alamat
    deskripsi: '',
    surat_halal: '',
    nib: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Anotasi tipe untuk error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // Inisialisasi useRouter

  const API_BASE_URL = 'http://127.0.0.1:8000';
  const TOKEN = 'AmA7kXOEfuiVCO1ZiUj0C5En34u7RxiSODn96EIv19bf6872'; // Token Anda

  // Fungsi untuk mengambil data pengaturan
  const fetchPengaturan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/penyedia/restoran`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data pengaturan.');
      }

      const result = await response.json();
      // Pastikan struktur data sesuai dengan yang diharapkan
      if (result.status === 'success' && result.data) {
        setFormData({
          nama: result.data.nama || '',
          email: result.data.email || '',
          no_hp: result.data.no_hp || '',
          nama_restoran: result.data.nama_restoran || '',
          lokasi: result.data.lokasi || '',
          deskripsi: result.data.deskripsi || '',
          surat_halal: result.data.surat_halal || '',
          nib: result.data.nib || '',
        });
      } else {
        throw new Error('Format data respons tidak sesuai.');
      }
    } catch (err: unknown) { // Perbaikan di sini: 'err' is of type 'unknown'.
      console.error('Error fetching pengaturan:', err);
      let errorMessage = 'Terjadi kesalahan saat mengambil data.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetchPengaturan saat komponen di-mount
  useEffect(() => {
    fetchPengaturan();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  // Handler untuk perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Perbaikan di sini: Parameter 'e' implicitly has an 'any' type.
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler untuk submit form (update pengaturan)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Perbaikan di sini: Parameter 'e' implicitly has an 'any' type.
    e.preventDefault(); // Mencegah refresh halaman
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/penyedia/restoran`, {
        method: 'POST', // Menggunakan POST untuk update sesuai instruksi
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Kirim formData sebagai body JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data pengaturan.');
      }

      const result = await response.json();
      if (result.status === 'success') {
        alert('Pengaturan berhasil diperbarui!');
        fetchPengaturan(); // Muat ulang data setelah update berhasil
      } else {
        throw new Error(result.message || 'Gagal memperbarui pengaturan.');
      }
    } catch (err: unknown) { // Perbaikan di sini: 'err' is of type 'unknown'.
      console.error('Error updating pengaturan:', err);
      let errorMessage = 'Terjadi kesalahan saat memperbarui pengaturan.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      alert(`Gagal menyimpan: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6 text-center">Memuat data pengaturan...</div>;
  }

  if (error) {
    return <div className="max-w-5xl mx-auto p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <form onSubmit={handleSubmit}> {/* Gunakan form dan onSubmit */}
        {/* Grid untuk dua kolom pertama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama" // Tambahkan atribut name
              value={formData.nama} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nama Restoran</label>
            <input
              type="text"
              name="nama_restoran" // Tambahkan atribut name
              value={formData.nama_restoran} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Field lainnya satu kolom */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Alamat</label>
            <input
              type="text"
              name="lokasi" // Tambahkan atribut name, sesuaikan dengan 'lokasi' di API
              value={formData.lokasi} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Deskripsi</label>
            <input
              type="text"
              name="deskripsi" // Tambahkan atribut name
              value={formData.deskripsi} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email" // Tambahkan atribut name
              value={formData.email} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">No HP</label>
            <input
              type="tel"
              name="no_hp" // Tambahkan atribut name
              value={formData.no_hp} // Gunakan value dari state
              onChange={handleChange} // Tambahkan onChange handler
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Grid untuk dua kolom lagi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Surat Keterangan Halal</label>
              <input
                type="text"
                name="surat_halal" // Tambahkan atribut name
                value={formData.surat_halal} // Gunakan value dari state
                onChange={handleChange} // Tambahkan onChange handler
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Nomor Induk Berusaha</label>
              <input
                type="text"
                name="nib" // Tambahkan atribut name
                value={formData.nib} // Gunakan value dari state
                onChange={handleChange} // Tambahkan onChange handler
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            type="button" // Gunakan type="button" agar tidak submit form
            onClick={() => {
              // Handle cancel, misalnya reset form atau navigasi
              fetchPengaturan(); // Muat ulang data awal
              alert('Perubahan dibatalkan!');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit" // Gunakan type="submit" untuk memicu handleSubmit
            disabled={isSubmitting} // Nonaktifkan tombol saat sedang submit
            className="bg-[#3d0d0d] hover:bg-[#2e0a0a] text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}