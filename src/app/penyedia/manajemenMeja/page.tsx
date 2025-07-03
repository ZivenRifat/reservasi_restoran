// src/app/Restoran/manajemenMeja/MejaPage.tsx
// Ubah nama file ini jika Anda menamainya "MejaPage.tsx" bukan "App.tsx"

'use client';

import TableList from "./components/TableList"; // Import TableList

export default function MejaPage() {
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto p-6">
      {/* TableList akan menangani tampilan layout denah dan daftar meja */}
      <TableList /> 
    </div>
  );
}