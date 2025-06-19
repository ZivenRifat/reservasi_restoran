'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter dari Next.js

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noHp, setNoHp] = useState('');
  const router = useRouter(); // Inisialisasi useRouter

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, noHp });
    
    // Logika registrasi atau login di sini
    // Misalnya, setelah proses berhasil, arahkan pengguna ke halaman login
    // Sebagai contoh, setelah registrasi berhasil:
    router.push('/login'); // Arahkan ke halaman login setelah registrasi
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <h1 className="text-4xl font-bold mb-6">LOGO</h1>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <input
              type="text" // Ganti menjadi text, karena ini untuk nama
              placeholder="Masukkan Nama"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Masukkan Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3A0E0E] text-white py-3 rounded-md hover:bg-[#4b1c1c]"
          >
            Daftar
          </button>
        </form>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:block w-1/2">
        <img
          src="/login-image.png"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
