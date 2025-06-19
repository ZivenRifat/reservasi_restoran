import { Users, Store } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'pelanggan' | 'pemilik';
  onTabChange: (tab: 'pelanggan' | 'pemilik') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('pelanggan')}
          className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pelanggan'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} />
          Pelanggan
        </button>
        <button
          onClick={() => onTabChange('pemilik')}
          className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pemilik'
              ? 'border-black text-black bg-gray-50'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Store size={18} />
          Pemilik Restoran
        </button>
      </div>
    </div>
  );
}