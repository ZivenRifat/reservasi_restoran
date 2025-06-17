export type MenuItem = {
  id: string;            // UUID string
  nama: string;
  harga: string;         // string, karena dari API berupa string angka "10000.00"
  foto: string;
  jenis: "makanan" | "minuman";
  deskripsi?: string;
  status?: string;
  highlight?: number;
  jumlah: number;
  subtotal: number;
  restoranId: string;
};