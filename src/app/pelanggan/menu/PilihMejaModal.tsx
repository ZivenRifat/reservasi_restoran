"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import KonfirmasiPesananModal from "../menu/KonfirmasiPesananModal";
import ReceiptModal from "../menu/ReceiptModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { MenuItem } from "@/app/types";
import dayjs from "dayjs";
import { API_URL } from "@/constant";

// ... (semua interface dan state tetap sama)
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
  tables?: Table[];
  onClose: () => void;
  onSubmit: (tableId: string) => void;
  cart: { [menu_id: string]: number };
  menu?: MenuItem[];
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
    // ... (semua state dan fungsi di atas return tetap sama)
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [profil, setProfil] = useState<ProfilPemesan | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [restoranNama, setRestoranNama] = useState<string>("");
    const [denahMejaUrl, setDenahMejaUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finalReservationData, setFinalReservationData] = useState<any>(null);

    const router = useRouter();

    const totalHargaLokal = Object.entries(cart).reduce((total, [menu_id, jumlah]) => {
      const item = menu.find((item) => item.menu_id === menu_id);
      return item ? total + item.harga * jumlah : total;
    }, 0);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = Cookies.get("auth_token");
          if (!token) throw new Error("Token tidak ditemukan.");
  
          const [profilRes, restoranRes] = await Promise.all([
            fetch(`${API_URL}/api/pemesan/profil`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/api/restoran/${restoran_id}`),
          ]);
  
          if (!profilRes.ok) throw new Error("Gagal mengambil profil pemesan.");
          if (!restoranRes.ok) throw new Error("Gagal mengambil data restoran.");
  
          const profilData = await profilRes.json();
          const restoranData = await restoranRes.json();
  
          setProfil(profilData.data);
          setTables(restoranData.data.meja || []);
          setRestoranNama(restoranData.data.nama || "");
          setDenahMejaUrl(restoranData.data.denah_meja?.url || "");
  
        } catch (error: any) {
          setError(error.message || "Terjadi kesalahan.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [restoran_id]);
  
    const handleSelectTable = (table: Table) => {
      if (parseInt(jumlah_orang) > table.kapasitas) {
        setError(`Jumlah orang melebihi kapasitas. Maksimum ${table.kapasitas} orang untuk meja ini.`);
        setSelectedTable(null);
      } else {
        setError(null);
        setSelectedTable(table);
      }
    };
  
    const handleSubmit = () => {
      if (!selectedTable) {
        setError("Pilih meja terlebih dahulu.");
        return;
      }
      setShowConfirmModal(true);
    };
  
    const handleConfirm = async (catatanFinal: string) => {
      if (!selectedTable) return;
  
      setLoading(true);
      setError(null);
      setShowConfirmModal(false);
  
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Anda harus login untuk memesan.");
  
        const requestBody = {
          restoran_id: restoran_id,
          tanggal: dayjs(tanggal).format("YYYY-MM-DD"),
          jam: jam,
          jumlah_orang: parseInt(jumlah_orang),
          kursi_id: selectedTable.id,
          catatan: catatanFinal, // Gunakan catatan dari modal
          menu: Object.entries(cart).map(([menu_id, jumlah]) => ({
            menu_id: menu_id,
            jumlah: jumlah,
          })),
        };
  
        const res = await fetch(`${API_URL}/api/pemesan/reservasi/pesan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });
  
        const responseData = await res.json();
  
        if (!res.ok) {
          throw new Error(responseData.message || "Gagal melakukan reservasi.");
        }
  
        setFinalReservationData(responseData.data);
        setShowReceiptModal(true);
  
      } catch (err: any) {
        console.error("Error submit reservation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleFinish = () => {
      router.push("/restoran");
    };

    return (
    <>
      {/* Modal Pilih Meja */}
      {!showConfirmModal && !showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-[#481111]"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-center mb-6">Denah Restoran</h2>
            {denahMejaUrl ? (
              <div className="mb-6"><img src={denahMejaUrl} alt="Denah Restoran" className="w-full h-auto object-contain" /></div>
            ) : (
              <p className="text-center text-sm text-gray-500 mb-6">Tidak ada gambar denah.</p>
            )}

            <div className="mb-4">
              <p className="font-semibold mb-2 text-center">Pilih Nomor Meja</p>
              <div className="grid grid-cols-4 gap-2">
                {tables.map((table) => (
                  <button
                    key={table.id}
                    disabled={table.status !== "tersedia"}
                    onClick={() => handleSelectTable(table)}
                    className={`p-2 rounded-md text-sm font-semibold transition-all duration-200
                      ${selectedTable?.id === table.id
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
                  Meja {selectedTable.nomor_kursi} (Kapasitas: {selectedTable.kapasitas} orang) telah dipilih.
                </p>
              )}
            </div>

            <div className="flex justify-center items-center space-x-4 mb-6 text-sm">
              <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-gray-200 rounded" /><span>Tersedia</span></div>
              <div className="flex items-center space-x-1"><div className="w-4 h-4 bg-gray-400 rounded" /><span>Tidak Tersedia</span></div>
            </div>

            {/* REVISI 3: Tampilkan pesan error kapasitas di sini */}
            {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!selectedTable || loading}
              className={`w-full py-2 rounded-md font-bold transition ${selectedTable ? "bg-[#481111] text-white hover:bg-[#6b1b1b]" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              {loading ? "Memproses..." : "Pesan"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {showConfirmModal && profil && selectedTable && (
        <KonfirmasiPesananModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          data={{
            namaPemesan: profil.nama,
            phoneNumber: profil.no_hp,
            email: profil.email,
            nama: restoranNama,
            tanggal: dayjs(tanggal).format("dddd, D MMMM YYYY"),
            jam: jam,
            jumlah_orang: parseInt(jumlah_orang),
            nomor_kursi: selectedTable.nomor_kursi,
            catatan: "",
            totalHarga: totalHargaLokal,
            
            // REVISI: Hitung dan sertakan `subtotal` untuk setiap item menu
            menu: menu
              .filter(item => cart[item.menu_id])
              .map(item => ({
                nama: item.nama,
                jumlah: cart[item.menu_id],
                subtotal: item.harga * cart[item.menu_id] // Kalkulasi subtotal ditambahkan di sini
              }))
          }}
        />
      )}

      {/* Nota / Receipt */}
      {showReceiptModal && finalReservationData && profil && (
        <ReceiptModal
            onClose={handleFinish}
          onFinish={handleFinish}
          data={{
            id: finalReservationData.nomor_reservasi,
            namaPemesan: profil.nama,
            phoneNumber: profil.no_hp,
            email: profil.email,
            namaRestoran: restoranNama,
            tanggal: dayjs(finalReservationData.tanggal).format("dddd, D MMMM YYYY"),
            jam: finalReservationData.waktu,
            jumlah_orang: finalReservationData.jumlah_orang,
            totalHarga: finalReservationData.total_harga,
            restoran_id: finalReservationData.restoran_id,
            kursi_id: finalReservationData.kursi_id,
            catatan: finalReservationData.catatan ?? "",
            menu: finalReservationData.menu.map((m: any) => ({ menu_id: m.menu_id, jumlah: m.jumlah })),
          }}  
        />
      )}
    </>
  );
}