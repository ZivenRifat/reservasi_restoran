'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/constant'; // pastikan import ini benar

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noHp, setNoHp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama,
          email,
          kata_sandi: password,
          no_hp: noHp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registrasi gagal');
        return;
      }

      if (data.status === 'success') {
        // Registrasi berhasil, arahkan ke halaman login
        router.push('/login');
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Form Register */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <h1 className="text-4xl font-bold mb-6">LOGO</h1>

        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <input
              type="text"
              placeholder="Masukkan Nama"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Masukkan Email"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">No Hp</label>
            <input
              type="tel"
              placeholder="Masukkan No Hp"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#3A0E0E] text-white py-3 rounded-md hover:bg-[#4b1c1c]"
            disabled={isLoading}
          >
            {isLoading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:block w-1/2">
        <img
          src="/login-image.png"
          alt="Register Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
