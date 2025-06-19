export type MenuItem = {
  menu_id: string;        
  nama: string;
  harga: number;         
  foto: string;
  jenis: "makanan" | "minuman";
  deskripsi?: string;
  status?: string;
  highlight?: number;
  jumlah: number;
  subtotal: number;
  restoranId: string;
};