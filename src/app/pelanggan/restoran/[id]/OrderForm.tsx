"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";


const generateTimeSlots = () => {
  const slots = [];
  const startTime = 8;
  const endTime = 22;
  for (let hour = startTime; hour <= endTime; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < endTime) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface OrderFormProps {
  restoranId: string;
}

export default function OrderForm({ restoranId }: OrderFormProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [jumlahOrang, setJumlahOrang] = useState("1");
  const [tanggal, setTanggal] = useState("");
  
  // REVISI 1: Ubah state awal 'jam' menjadi null agar tidak ada yang terpilih
  const [jam, setJam] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // REVISI 2: Tambahkan validasi untuk memastikan jam sudah dipilih
    if (!jam) {
      alert("Silakan pilih jam terlebih dahulu.");
      return; // Hentikan proses jika jam belum dipilih
    }
    
    if (isLoggedIn) {
      router.push(
        `/pelanggan/menu/${restoranId}?orang=${jumlahOrang}&tanggal=${tanggal}&jam=${jam}`
      );
    } else {
      alert("Anda harus login terlebih dahulu untuk membuat pesanan.");
      router.push("/login"); 
    }
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
        <option value="5">5 Orang</option>
        <option value="6">6 Orang</option>
      </select>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        required
        min={new Date().toISOString().split("T")[0]}
      />
      
      <Listbox value={jam} onChange={setJam}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded border bg-white p-2 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {/* REVISI 3: Tampilkan 'Pilih Jam' jika state jam masih null */}
            <span className={`block truncate ${!jam ? 'text-gray-400' : ''}`}>
              {jam ?? 'Pilih Jam'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
              {timeSlots.map((slot, slotIdx) => (
                <Listbox.Option
                  key={slotIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={slot}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {slot}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      <button
        type="submit"
        className="bg-[#481111] text-white py-2 w-full rounded font-semibold"
      >
        Pilih Menu
      </button>
    </form>
  );
}