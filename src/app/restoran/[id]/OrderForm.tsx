"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface OrderFormProps {
  restoranId: string;
}

export default function OrderForm({ restoranId }: OrderFormProps) {
  const router = useRouter();
  const [jumlahOrang, setJumlahOrang] = useState("1");
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(
      `/menu/${restoranId}?orang=${jumlahOrang}&tanggal=${tanggal}&waktu=${waktu}`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        className="w-full p-2 border rounded"
        value={jumlahOrang}
        onChange={(e) => setJumlahOrang(e.target.value)}
      >
        <option value="1">1 Orang</option>
        <option value="2">2 Orang</option>
        <option value="3">3 Orang</option>
        <option value="4">4 Orang</option>
      </select>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        required
      />
      <input
        type="time"
        className="w-full p-2 border rounded"
        value={waktu}
        onChange={(e) => setWaktu(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-[#481111] text-white py-2 w-full rounded font-semibold"
      >
        Pilih Menu
      </button>
    </form>
  );
}
