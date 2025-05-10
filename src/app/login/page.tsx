"use client"; // Harus di paling atas

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Ganti ke navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error

    // Logging data email dan password untuk memastikan koneksi data
    console.log("Logging in with:", { email, password });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Periksa status respons terlebih dahulu
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Login failed, please try again.");
      }

      // Dapatkan data JSON dari respons
      const data = await response.json();

      // Log data yang diterima dari server
      console.log("Received data from API:", data);

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        router.push("/profile");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <h1 className="text-4xl font-bold mb-6">LOGO</h1>
        <h2 className="text-xl font-bold mb-2">Selamat Datang!</h2>
        <p className="text-gray-600 mb-6">Silahkan login untuk melanjutkan</p>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
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
            <p className="text-right text-sm text-blue-500 mt-1 cursor-pointer">
              Lupa password
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {isLoading ? (
            <p className="text-blue-500 text-sm">Login sedang diproses...</p>
          ) : (
            <button
              type="submit"
              className="w-full bg-[#3A0E0E] text-white py-3 rounded-md hover:bg-[#4b1c1c]"
            >
              LOGIN
            </button>
          )}
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Tidak punya akun?{" "}
          <Link href="/registrasi" className="text-blue-600 hover:underline">
            Buat akun
          </Link>
        </p>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:block w-1/2">
        <img
          src="/images/LoginPage.jpg"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
