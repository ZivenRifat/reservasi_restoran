// src/components/types/index.ts

export interface Reservasi {
  id?: string;
  nama: string;
  jumlah_orang: number;
  waktu: string;
  nomor_meja: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  tanggal?: string;
  no_telepon?: string;
  catatan?: string;
}

export interface JamOperasional {
  id?: string;
  restoran_id?: string;
  jam_buka: string;
  jam_tutup: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardData {
  total_pelanggan: number;
  total_reservasi: number;
  total_dibatalkan: number;
  reservasi_terbaru: Reservasi[];
  status: 'buka' | 'tutup';
  jam_operasional: JamOperasional | null;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: any;
}