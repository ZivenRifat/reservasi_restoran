// src/app/Restoran/manajemenMeja/components/TableLayout.tsx

interface TableLayoutProps {
  uploadedDenahUrl: string | null;
}

export default function TableLayout({ uploadedDenahUrl }: TableLayoutProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-slate-200">
      {/* Removed the <h2 className="text-lg font-semibold text-gray-800">Pengaturan Tata Letak Restoran</h2> */}
      {/* because the main heading is now in TableList.tsx */}
      
      {uploadedDenahUrl ? (
        <div className="mb-4">
          {/* <h3 className="text-md font-medium text-gray-700 mb-2">Denah Aktif:</h3> */}
          {/* Removed "Denah Aktif" heading as the parent handles the main section title */}
          <img 
            src={uploadedDenahUrl} 
            alt="Denah Restoran" 
            className="max-w-full h-auto rounded-lg shadow-md border border-slate-300 mx-auto" // Added mx-auto for centering
          />
          {/* <p className="text-sm text-gray-500 mt-2">URL Denah: {uploadedDenahUrl}</p> */}
          {/* Removed URL display for cleaner UI, can be re-added if needed for debugging */}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-4"> {/* Added text-center and py-4 for better display */}
          Belum ada denah restoran yang diunggah. Silakan unggah denah dari halaman manajemen meja.
        </p>
      )}

      {/* Area untuk elemen UI tata letak lainnya (misalnya, representasi meja) */}
      
    </div>
  );
}