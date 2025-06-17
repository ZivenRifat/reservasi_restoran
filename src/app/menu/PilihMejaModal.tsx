"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import KonfirmasiPesananModal from "@/app/menu/KonfirmasiPesananModal";
import ReceiptModal from "@/app/menu/ReceiptModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { MenuItem } from "@/app/types";

interface Table {
  id: string;
  nomor_kursi: number;
  kapasitas: number;
  posisi: string;
  status: string;
}

interface ProfilPemesan {
  nama: string;
  email: string;
  no_hp: string;
}

interface PilihMejaModalProps {
  onClose: () => void;
  onSubmit: (tableId: string) => void;
  menu?: MenuItem[];
  tables?: Table[];
  restoranId: string;
  jumlah_orang: string;
  tanggal: string;
  waktu: string;
}

export default function PilihMejaModal({
  onClose,
  onSubmit,
  menu = [],
  restoranId,
  jumlah_orang,
  tanggal,
  waktu,
}: PilihMejaModalProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [profil, setProfil] = useState<ProfilPemesan | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [restoranNama, setRestoranNama] = useState<string>("");
  const [denahMejaUrl, setDenahMejaUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState<any>(null);

  const router = useRouter();

  const totalHarga = menu.reduce(
    (total, item) => total + parseInt(item.harga),
    0
  );

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("auth_token");

        if (!token) throw new Error("Token tidak ditemukan.");

        const profilRes = await fetch(
          "http://127.0.0.1:8000/api/pemesan/profil",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!profilRes.ok) {
          const err = await profilRes.json();
          throw new Error(
            `Gagal ambil profil: ${err.message || profilRes.statusText}`
          );
        }

        const profilData = await profilRes.json();
        setProfil(profilData.data);

        const resRestoran = await fetch(
          `http://127.0.0.1:8000/api/restoran/${restoranId}`
        );
        const dataRestoran = await resRestoran.json();
        const { meja, denah_meja, nama } = dataRestoran.data;

        setTables(meja.filter((m: Table) => m.status === "tersedia"));
        setDenahMejaUrl(`http://127.0.0.1:8000/denah/${denah_meja}`);
        setRestoranNama(nama);
      } catch (error: any) {
        console.error("Error saat mengambil data:", error.message);
        setError(error.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Siapkan data lengkap reservasi untuk dikirim ke backend

  const submitReservation = async () => {
    if (!selectedTable) {
      setError("Silakan pilih meja terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("auth_token");

      if (!token) throw new Error("Token tidak ditemukan.");

      const res = await fetch(
        "http://127.0.0.1:8000/api/pemesan/reservasi/pesan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal melakukan reservasi");
      }

      const data = await res.json();
      console.log("Reservasi sukses:", data);

      setShowConfirmModal(false);
      setShowReceiptModal(true);
    } catch (err: any) {
      console.error("Error submit reservation:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedTable) {
      setError("Pilih meja terlebih dahulu.");
      return;
    }

        const reservation = {
    tanggal,
    waktu,
    jumlah_orang: parseInt(jumlah_orang),
    catatan: "Mohon kursi dekat jendela.",
    kursi_id: selectedTable,
    menu: menu.map((item) => ({
      id: item.id,
      jumlah: 1,
    })),
  };
  setReservationData(reservation);
  setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    submitReservation();
  };

  const handleFinish = () => {
    if (selectedTable) {
      onSubmit(selectedTable);
      setShowReceiptModal(false);
      onClose();
      router.push("/restoran");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#481111]"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-bold text-center mb-6">Denah Restoran</h2>

          {denahMejaUrl ? (
            <div className="mb-6">
              <img
                src={denahMejaUrl}
                alt="Denah Restoran"
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 mb-6">
              Tidak ada gambar denah.
            </p>
          )}

          <div className="mb-4">
            <p className="font-semibold mb-2 text-center">Pilih Nomor Meja</p>
            <div className="grid grid-cols-4 gap-2">
              {tables.map((table) => (
                <button
                  key={table.id}
                  disabled={table.status !== "tersedia"}
                  onClick={() => setSelectedTable(table.id)}
                  className={`p-2 rounded-md text-sm font-semibold transition-all duration-200
                    ${
                      selectedTable === table.id
                        ? "bg-white text-[#481111] border-2 border-[#481111]"
                        : table.status === "tersedia"
                        ? "bg-gray-200 text-black hover:bg-[#d6b5b5]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                >
                  {table.nomor_kursi}
                </button>
              ))}
            </div>
            {selectedTable && (
              <p className="text-center text-sm text-green-600 mt-2">
                Meja {tables.find((t) => t.id === selectedTable)?.nomor_kursi}{" "}
                telah dipilih.
              </p>
            )}
          </div>

          <div className="flex justify-center items-center space-x-4 mb-6 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-400 rounded" />
              <span>Tidak Tersedia</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedTable || loading}
            className={`w-full py-2 rounded-md font-bold transition
              ${
                selectedTable
                  ? "bg-[#481111] text-white hover:bg-[#6b1b1b]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            {loading ? "Memproses..." : "Pesan"}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      </div>

      {showConfirmModal && profil && reservationData && (
        <KonfirmasiPesananModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          data={{
            namaPemesan: profil.nama,
            phoneNumber: profil.no_hp,
            email: profil.email,
            nama: restoranNama,
            tanggal: new Date(reservationData.tanggal).toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            waktu: reservationData.waktu + " WIB",
            jumlah_orang: reservationData.jumlah_orang,
            totalHarga,
            menu: menu.map((item) => ({
              ...item,
              jumlah: 1,
              subtotal: parseInt(item.harga),
            })),
          }}
        />
      )}

      {showReceiptModal && (
        <ReceiptModal
          onClose={() => setShowReceiptModal(false)}
          onFinish={handleFinish}
        />
      )}
    </>
  );
}
