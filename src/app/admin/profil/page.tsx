// src/app/admin/profile/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCookie, deleteCookie } from 'cookies-next'; // Import getCookie dan deleteCookie
import { useRouter } from 'next/navigation'; // Import useRouter

interface AdminProfileResponse {
  status: string;
  message: string;
  data: {
    nama: string;
    email: string;
    no_hp?: string;
  };
}

interface AdminUpdateResponse {
  status: string;
  message: string;
  data?: {
    nama: string;
    email: string;
    no_hp?: string;
  };
}

// Gunakan variabel lingkungan untuk URL dasar jika memungkinkan (misalnya: process.env.NEXT_PUBLIC_API_BASE_URL)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ProfileAdmin() {
  // Hapus HARDCODED_FALLBACK_TOKEN dan penggunaan localStorage
  // const HARDCODED_FALLBACK_TOKEN = 'YCXYVZHkCUCc9xNZsOU19q5FqxfQ8oKA3bHLhAoR1e10ab98';

  const [form, setForm] = useState({
    nama: '',
    email: '',
    noHp: '',
    password: '', // Current password
    passwordBaru: '', // New password
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State untuk token otentikasi
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const router = useRouter(); // Inisialisasi router

  // Handler untuk otentikasi gagal
  const handleAuthError = useCallback(() => {
    setError('Sesi Anda telah berakhir. Silakan login kembali.');
    deleteCookie('auth_token'); // Hapus cookie yang mungkin sudah kadaluarsa/invalid
    router.push('/login'); // Arahkan ke halaman login
  }, [router]);

  // Effect untuk mengambil token dari cookie saat komponen dimuat
  useEffect(() => {
    const retrieveToken = async () => {
      const storedToken = await getCookie('auth_token'); // Menggunakan nama cookie yang benar
      if (typeof storedToken === 'string') {
        setAuthToken(storedToken);
      } else {
        console.log('No authentication token found for ProfileAdmin. Redirecting to login.');
        setAuthToken(undefined); // Pastikan state token diatur ke undefined
        // Langsung panggil handleAuthError untuk redirect
        handleAuthError();
      }
    };
    retrieveToken();
  }, [handleAuthError]); // handleAuthError sebagai dependency karena useCallback

  // Effect untuk mengambil profil admin setelah token tersedia
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (authToken === undefined) { // Tunggu hingga token selesai diambil dari cookie
        setLoading(true); // Tetap loading jika token belum siap
        return;
      }
      if (!authToken) { // Jika token kosong (setelah mencoba ambil), jangan lanjutkan
        setLoading(false);
        setError('Token otentikasi tidak ditemukan. Silakan login.');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const requestUrl = `${API_BASE_URL}/admin/profile/edit`;
        console.log('DEBUG (GET): Mengambil data dari URL:', requestUrl);

        const res = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Gunakan authToken dari state
            'Accept': 'application/json',
          },
        });

        console.log('DEBUG (GET): Status respons:', res.status);

        if (res.status === 401) {
          handleAuthError(); // Panggil handler auth error
          return;
        }

        if (!res.ok) {
          let errorMessage = `Request gagal dengan status ${res.status}: ${res.statusText}`;
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.log('Tidak dapat mem-parse error response sebagai JSON');
          }

          if (res.status === 404) {
            throw new Error('Data profil admin tidak ditemukan. Periksa token atau hubungi administrator sistem.');
          } else {
            throw new Error(errorMessage);
          }
        }

        let responseData: AdminProfileResponse;
        try {
          responseData = await res.json();
        } catch (jsonError) {
          throw new Error(`Respons bukan JSON atau kosong: ${res.status} ${res.statusText}`);
        }

        console.log('DEBUG (GET): Respons dari API:', responseData);

        if (responseData.status !== 'success' || !responseData.data) {
          throw new Error('Format respons tidak sesuai atau status tidak berhasil.');
        }

        const data = responseData.data;

        if (!data.nama || !data.email) {
          throw new Error('Data profil tidak lengkap atau tidak sesuai format yang diharapkan.');
        }

        setForm({
          nama: data.nama,
          email: data.email,
          noHp: data.no_hp || '',
          password: '',
          passwordBaru: '',
        });

      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal saat mengambil data profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [authToken, handleAuthError]); // authToken dan handleAuthError sebagai dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!authToken) { // Pengecekan token sebelum submit
      setError('Token otentikasi tidak ditemukan. Silakan login.');
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, string> = {
        nama: form.nama,
        email: form.email,
        no_hp: form.noHp,
      };

      if (form.passwordBaru && form.passwordBaru.trim() !== '') {
        if (!form.password || form.password.trim() === '') {
          throw new Error('Password saat ini harus diisi jika ingin mengubah password.');
        }
        payload.kata_sandi = form.password;
        payload.kata_sandi_baru = form.passwordBaru;
      }

      const requestUrl = `${API_BASE_URL}/admin/profile/edit`; // Pastikan ini sesuai dengan backend Anda
      console.log('DEBUG (PUT): Mengirim data ke URL:', requestUrl);
      console.log('DEBUG (PUT): Payload yang dikirim:', payload);

      const res = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`, // Gunakan authToken dari state
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('DEBUG (PUT): Status respons:', res.status);

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      if (!res.ok) {
        let errorMessage = `Update gagal dengan status ${res.status}: ${res.statusText}`;

        try {
          const errorData = await res.json();
          console.log('DEBUG (PUT): Error response:', errorData);

          if (res.status === 422 && errorData.message) {
            setError(`Validasi gagal: ${errorData.message}`);
            setLoading(false);
            return;
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (jsonError) {
          console.log('Tidak dapat mem-parse error response sebagai JSON');
        }

        throw new Error(errorMessage);
      }

      let responseData: AdminUpdateResponse;
      try {
        responseData = await res.json();
      } catch (jsonError) {
        throw new Error(`Respons bukan JSON atau kosong saat update: ${res.status} ${res.statusText}`);
      }

      console.log('DEBUG (PUT): Respons dari API:', responseData);

      if (responseData.status === 'success') {
        setSuccessMessage(responseData.message || 'Profil admin berhasil diperbarui!');

        if (responseData.data) {
          setForm(prev => ({
            ...prev,
            nama: responseData.data!.nama,
            email: responseData.data!.email,
            noHp: responseData.data!.no_hp || '',
            password: '',
            passwordBaru: '',
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            password: '',
            passwordBaru: '',
          }));
        }
      } else {
        throw new Error(responseData.message || 'Update gagal');
      }

    } catch (err) {
      console.error('Error submitting admin profile:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal saat memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading spinner jika token sedang diambil atau data sedang dimuat
  if (authToken === undefined || (loading && !form.nama && !error && authToken)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Memuat data profil...
        </div>
      </div>
    );
  }

  // Tampilkan pesan error jika token tidak ada setelah mencoba mengambilnya
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
    <div className="bg-white p-8 rounded shadow-md max-w-5xl w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profil Admin</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Berhasil! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nama" className="block text-sm font-medium mb-1">Nama</label>
          <input
            id="nama"
            name="nama"
            type="text"
            value={form.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan email"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="noHp" className="block text-sm font-medium mb-1">No. HP</label>
          <input
            id="noHp"
            name="noHp"
            type="text"
            value={form.noHp}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan No. HP"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password Saat Ini</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan password saat ini (diperlukan jika ingin mengubah password)"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="passwordBaru" className="block text-sm font-medium mb-1">Password Baru</label>
          <input
            id="passwordBaru"
            name="passwordBaru"
            type="password"
            value={form.passwordBaru}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Biarkan kosong jika tidak ingin mengubah password"
            disabled={loading}
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#6A1B1A] text-white px-6 py-2 rounded hover:bg-[#8B2C2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Perbarui Profil'}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
        {/* Placeholder for future debug/info */}
      </div>
    </div>
  );
}