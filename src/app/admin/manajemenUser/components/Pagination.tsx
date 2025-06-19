interface PaginationProps {
  activeTab: 'pelanggan' | 'pemilik';
  totalUsers: number;
}

export default function Pagination({ activeTab, totalUsers }: PaginationProps) {
  if (totalUsers === 0) return null;

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Menampilkan data {activeTab === 'pelanggan' ? 'pelanggan' : 'pemilik restoran'}
        </div>
        <div className="flex items-center space-x-2">
          <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {'|<'}
          </button>
          <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {'<'}
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-white bg-black">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors">
            2
          </button>
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            ...
          </span>
          <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            {'>'}
          </button>
          <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            {'>|'}
          </button>
        </div>
      </div>
    </div>
  );
}