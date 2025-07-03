'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

// --- Helper Function for Cookies ---
/**
 * Helper function to get the value of a cookie by its name.
 * IMPORTANT: This function is intended for client-side use only.
 * It will return null in a server-side rendering (SSR) environment.
 * @param name The name of the cookie to retrieve.
 * @returns The cookie's value or null if not found.
 */
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

// --- Component ---
export default function PengaturanPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    nama_restoran: '',
    lokasi: '',
    deskripsi: '',
    nib: '',
  });
  const [halalFile, setHalalFile] = useState<File | null>(null);
  const [halalFileUrl, setHalalFileUrl] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [restaurantPhotos, setRestaurantPhotos] = useState<File[]>([]);
  const [restaurantPhotoUrls, setRestaurantPhotoUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
  const AUTH_TOKEN = getCookie('auth_token');

  // Fungsi untuk mengambil data pengaturan
  const fetchPengaturan = useCallback(async () => {
    if (!AUTH_TOKEN) {
      setError('Autentikasi diperlukan. Mohon login ulang.');
      setLoading(false);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/penyedia/restoran`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data pengaturan.');
      }

      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const { data } = result;
        setFormData({
          nama: data.nama || '',
          email: data.email || '',
          no_hp: data.no_hp || '',
          nama_restoran: data.restoran?.nama || '',
          lokasi: data.restoran?.lokasi || '',
          deskripsi: data.restoran?.deskripsi || '',
          nib: data.restoran?.nib || '',
        });

        // Set URL untuk surat halal jika ada
        if (data.restoran?.surat_halal) {
          setHalalFileUrl(data.restoran.surat_halal);
        } else {
          setHalalFileUrl(null);
        }
        setHalalFile(null);

        // Set URL untuk foto utama restoran sebagai "foto profil" di UI
        if (data.restoran?.foto_utama?.url) {
          setProfilePhotoUrl(data.restoran.foto_utama.url);
        } else {
          setProfilePhotoUrl(null);
        }
        setProfilePhoto(null);

        // Set URL untuk foto restoran (galeri)
        if (data.restoran?.foto && Array.isArray(data.restoran.foto)) {
          setRestaurantPhotoUrls(data.restoran.foto.map((photo: { url: string }) => photo.url));
        } else {
          setRestaurantPhotoUrls([]);
        }
        setRestaurantPhotos([]);
      } else {
        throw new Error('Format data respons tidak sesuai.');
      }
    } catch (err: unknown) {
      console.error('Error fetching pengaturan:', err);
      let errorMessage = 'Terjadi kesalahan saat mengambil data.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, AUTH_TOKEN, router]);

  useEffect(() => {
    fetchPengaturan();
  }, [fetchPengaturan]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleHalalFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHalalFile(file);
      setHalalFileUrl(URL.createObjectURL(file));
    } else {
      setHalalFile(null);
    }
  }, []);

  const handleProfilePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setProfilePhotoUrl(URL.createObjectURL(file));
    } else {
      setProfilePhoto(null);
    }
  }, []);

  const handleRestaurantPhotosChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setRestaurantPhotos(filesArray);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setRestaurantPhotoUrls(prevUrls => [...prevUrls.filter(url => !url.startsWith('blob:')), ...newUrls]);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!AUTH_TOKEN) {
      setError('Autentikasi diperlukan. Mohon login ulang.');
      setIsSubmitting(false);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    // Debug: Log form data before sending
    console.log('Form data before sending:', formData);
    console.log('Files to upload:', {
      halalFile: halalFile?.name,
      profilePhoto: profilePhoto?.name,
      restaurantPhotos: restaurantPhotos.map(f => f.name)
    });

    try {
      // Method 1: Try with JSON first (for text fields only)
      const textOnlyUpdate = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        no_hp: formData.no_hp.trim(),
        nama_restoran: formData.nama_restoran.trim(),
        lokasi: formData.lokasi.trim(),
        deskripsi: formData.deskripsi.trim(),
        nib: formData.nib.trim(),
      };

      // First, update text fields
      const textResponse = await fetch(`${API_BASE_URL}/api/penyedia/restoran`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(textOnlyUpdate),
      });

      console.log('Text update response status:', textResponse.status);
      const textResponseText = await textResponse.text();
      console.log('Text update response body:', textResponseText);

      if (!textResponse.ok) {
        let errorMessage = 'Gagal memperbarui data teks.';
        try {
          const errorData = JSON.parse(textResponseText);
          errorMessage = errorData.message || errorMessage;
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            errorMessage += ': ' + errorMessages.join(', ');
          }
        } catch {
          errorMessage = `Server Error: ${textResponse.status} ${textResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // If there are files to upload, handle them separately
      if (halalFile || profilePhoto || restaurantPhotos.length > 0) {
        const fileData = new FormData();
        
        // Add method spoofing for Laravel
        fileData.append('_method', 'PUT');
        
        if (halalFile) {
          fileData.append('surat_halal', halalFile);
        }
        if (profilePhoto) {
          fileData.append('foto_utama', profilePhoto);
        }
        restaurantPhotos.forEach((file, index) => {
          fileData.append('foto[]', file);
        });

        console.log('Uploading files...');
        const fileResponse = await fetch(`${API_BASE_URL}/api/penyedia/restoran/files`, {
          method: 'POST', // Use POST with _method spoofing
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Accept': 'application/json',
          },
          body: fileData,
        });

        console.log('File upload response status:', fileResponse.status);
        const fileResponseText = await fileResponse.text();
        console.log('File upload response body:', fileResponseText);

        if (!fileResponse.ok) {
          let errorMessage = 'Gagal mengupload file.';
          try {
            const errorData = JSON.parse(fileResponseText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `File Upload Error: ${fileResponse.status} ${fileResponse.statusText}`;
          }
          console.warn('File upload failed, but text data was saved:', errorMessage);
          // Don't throw error here, just warn - text data is already saved
        }
      }

      alert('Pengaturan berhasil diperbarui!');
      await fetchPengaturan(); // Reload data after successful update
      
    } catch (err: unknown) {
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
  }, [API_BASE_URL, AUTH_TOKEN, formData, halalFile, profilePhoto, restaurantPhotos, fetchPengaturan, router]);

  const openModal = useCallback((imageUrl: string) => {
    setModalImageUrl(imageUrl);
  }, []);

  const closeModal = useCallback(() => {
    setModalImageUrl(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d0d0d]"></div>
          <p className="mt-2 text-gray-600">Memuat data pengaturan...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Autentikasi diperlukan')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#A32A2A] hover:bg-[#8e2525] text-white px-4 py-2 rounded transition duration-200"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Restoran</h1>
        <div className="flex items-center space-x-4">
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt="Foto Utama Restoran"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#A32A2A] cursor-pointer"
              onClick={() => openModal(profilePhotoUrl)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L20 18m-4-13a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          )}
          <label htmlFor="profile_photo" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-200 text-sm">
            Ubah Foto Utama
            <input
              type="file"
              id="profile_photo"
              name="profile_photo"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="nama" className="block font-medium text-gray-700 mb-1">Nama Pemilik</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="nama_restoran" className="block font-medium text-gray-700 mb-1">Nama Restoran</label>
            <input
              type="text"
              id="nama_restoran"
              name="nama_restoran"
              value={formData.nama_restoran}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="space-y-6 mb-6">
          <div>
            <label htmlFor="lokasi" className="block font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="deskripsi" className="block font-medium text-gray-700 mb-1">Deskripsi Restoran</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="no_hp" className="block font-medium text-gray-700 mb-1">No HP</label>
            <input
              type="tel"
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="surat_halal_upload" className="block font-medium text-gray-700 mb-1">Surat Keterangan Halal</label>
            <input
              type="file"
              id="surat_halal_upload"
              name="surat_halal_upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleHalalFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A32A2A] file:text-white hover:file:bg-[#8e2525]"
            />
            {halalFileUrl && (
              <div className="mt-2 text-sm text-gray-600">
                File saat ini:
                {halalFileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <img
                    src={halalFileUrl}
                    alt="Pratinjau Surat Halal"
                    className="max-h-32 mt-2 rounded-md object-contain cursor-pointer"
                    onClick={() => openModal(halalFileUrl)}
                  />
                ) : (
                  <a href={halalFileUrl} target="_blank" rel="noopener noreferrer" className="text-[#A32A2A] hover:underline">
                    {halalFile?.name || halalFileUrl.split('/').pop()}
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="nib" className="block font-medium text-gray-700 mb-1">Nomor Induk Berusaha</label>
            <input
              type="text"
              id="nib"
              name="nib"
              value={formData.nib}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="restaurant_photos" className="block font-medium text-gray-700 mb-1">Foto Restoran</label>
            <input
              type="file"
              id="restaurant_photos"
              name="restaurant_photos"
              accept="image/*"
              multiple
              onChange={handleRestaurantPhotosChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A32A2A] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A32A2A] file:text-white hover:file:bg-[#8e2525]"
            />
            {restaurantPhotoUrls.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {restaurantPhotoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Foto Restoran ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer"
                      onClick={() => openModal(url)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              fetchPengaturan();
              alert('Perubahan dibatalkan!');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !AUTH_TOKEN}
            className="bg-[#A32A2A] hover:bg-[#8e2525] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>

      {modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div className="relative p-4 max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
            >
              &times;
            </button>
            <img src={modalImageUrl} alt="Full Size Preview" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}