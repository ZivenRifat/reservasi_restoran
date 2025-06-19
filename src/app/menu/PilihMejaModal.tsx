"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import KonfirmasiPesananModal from "@/app/menu/KonfirmasiPesananModal";
import ReceiptModal from "@/app/menu/ReceiptModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { MenuItem } from "@/app/types";
import dayjs from "dayjs";

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
  cart: { [menu_id: string]: number };
  menu?: MenuItem[];
  tables?: Table[];
  restoran_id: string;
  jumlah_orang: string;
  tanggal: string;
  jam: string;
}

export default function PilihMejaModal({
  onClose,
  onSubmit,
  cart,
  menu = [],
  restoran_id,
  jumlah_orang,
  tanggal,
  jam,
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

  const totalHarga = Object.entries(cart).reduce((total, [menu_id, jumlah]) => {
    const item = menu.find((item) => item.menu_id === menu_id);
    return item ? total + item.harga * jumlah : total;
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = Cookies.get("auth_token");

        if (!token) throw new Error("Token tidak ditemukan.");

        // Fetch profil pemesan
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

        // Fetch data restoran
        const resRestoran = await fetch(
          `http://127.0.0.1:8000/api/restoran/${restoran_id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!resRestoran.ok) {
          const errText = await resRestoran.text();
          console.error("Isi response:", errText);
          throw new Error(
            `Gagal ambil restoran: ${resRestoran.status} - ${resRestoran.statusText}`
          );
        }

        console.log("restoran_id:", restoran_id);
        const dataRestoran = await resRestoran.json();
        const { meja = [], denah_meja, nama } = dataRestoran.data;

        // Meja bisa kosong, jadi perlu fallback []
        setTables(
          Array.isArray(meja)
            ? meja.filter((m: Table) => m.status === "tersedia")
            : []
        );
        setRestoranNama(nama ?? "");

        // Tangani URL denah_meja
        if (
          denah_meja &&
          typeof denah_meja === "object" &&
          denah_meja.nama_file
        ) {
          // Gunakan nama file dari database
          const filePath = `http://127.0.0.1:8000/denah/${restoran_id}/${denah_meja.nama_file}`;
          setDenahMejaUrl(filePath);
        } else {
          setDenahMejaUrl("");
        }
      } catch (error: any) {
        console.error("Error saat mengambil data:", error.message);
        setError(error.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restoran_id]);

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
        let errorText = await res.text(); // Ambil raw text jika bukan JSON
        console.error(
          "Gagal reservasi. Status:",
          res.status,
          "Body:",
          errorText
        );

        alert("Terjadi kesalahan saat mengirim reservasi:\n" + errorText);
        return;
      }

      const data = await res.json();
      console.log("Reservasi sukses:", data);

      // Simpan data backend untuk ditampilkan di nota
      setReservationData((prev: any) => ({
        ...prev,
        nomor_reservasi: data.data.nomor_reservasi,
        total_harga: data.data.total_harga,
      }));
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

    const selectedTableData = tables.find((t) => t.id === selectedTable);

    const tanggalFormatted = dayjs(tanggal).format("YYYY-MM-DD");
    const parseJam = (input: string): string => {
      const parts = input.split(":");
      if (parts.length !== 2) return "";
      const [jam, menit] = parts;
      return `${jam.padStart(2, "0")}:${menit.padStart(2, "0")}`;
    };

    const jamFormatted = parseJam(jam);

    const reservation = {
      restoran_id,
      tanggal: tanggalFormatted,
      jam: jamFormatted,
      jumlah_orang: parseInt(jumlah_orang),
      catatan: "Mohon kursi dekat jendela.",
      nomor_kursi: selectedTableData?.nomor_kursi,
      kursi_id: selectedTable,
      menu: menu
        .filter((item) => cart[item.menu_id])
        .map((item) => ({
          menu_id: item.menu_id,
          nama: item.nama,
          jumlah: cart[item.menu_id],
          subtotal: item.harga * cart[item.menu_id],
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
            tanggal: reservationData.tanggal,
            jam: reservationData.jam,
            jumlah_orang: reservationData.jumlah_orang,
            totalHarga,
            menu: menu.map((item) => ({
              ...item,
              jumlah: 1,
              subtotal: item.harga,
            })),
          }}
        />
      )}

      {showReceiptModal && reservationData && profil && (
        <ReceiptModal
          onClose={() => setShowReceiptModal(false)}
          onFinish={handleFinish}
          data={{
            id: reservationData.nomor_reservasi,
            namaPemesan: profil.nama,
            phoneNumber: profil.no_hp,
            email: profil.email,
            namaRestoran: restoranNama,
            tanggal: reservationData.tanggal,
            jam: reservationData.jam,
            jumlah_orang: reservationData.jumlah_orang,
            totalHarga: reservationData.total_harga ?? totalHarga,
            statusLog: [
              `Created at ${new Date(
                reservationData.created_at || Date.now()
              ).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })} WIB by customer`,
              `Come restaurant at ${reservationData.jam} WIB`,
            ],
            restoran_id: reservationData.restoran_id,
            kursi_id: reservationData.kursi_id,
            catatan: reservationData.catatan ?? "",
            menu:
              reservationData.menu?.map((m: any) => ({
                menu_id: m.menu_id,
                jumlah: m.jumlah,
              })) ?? [],
          }}
        />
      )}
    </>
  );
}
