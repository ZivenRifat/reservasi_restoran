
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [kata_sandi, setKataSandi] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, kata_sandi }), // Mengganti password menjadi kata_sandi
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
        router.push("/#");
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

            {/* Tombol ikon show/hide */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[42px] right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? (
                <AiOutlineEye size={22} />
              ) : (
                <AiOutlineEyeInvisible size={22} />
              )}
            </button>

          <div>
            <label className="block mb-1 font-medium">Kata Sandi</label>
            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={kata_sandi} // Mengganti password menjadi kata_sandi
              onChange={(e) => setKataSandi(e.target.value)} // Mengganti setPassword menjadi setKataSandi
              required
            />
            <p className="text-right text-sm text-blue-500 mt-1 cursor-pointer">
              Lupa kata sandi
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
