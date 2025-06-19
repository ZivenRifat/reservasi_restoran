import { Edit3, Users, Calendar, Clock, Phone, User, Trash2 } from 'lucide-react';

type User = {
  id: string;
  nama: string;
  email: string;
  peran: string;
  no_hp: string;
  created_at: string;
};

interface UserTableProps {
  users: User[];
  loading: boolean;
  activeTab: 'pelanggan' | 'pemilik';
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const formatDate = (dateString: string) => {
  try {
    const [date] = new Date(dateString).toLocaleString('id-ID').split(', ');
    return date;
  } catch {
    return '-';
  }
};

const formatTime = (dateString: string) => {
  try {
    const [, time] = new Date(dateString).toLocaleString('id-ID').split(', ');
    return time;
  } catch {
    return '-';
  }
};

export default function UserTable({ users, loading, activeTab, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <User size={16} />
                Nama
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                No HP
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Tanggal
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Jam
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user, idx) => (
              <tr key={user.id || idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-sm font-medium text-gray-700">
                        {user.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                      {user.email && (
                        <div className="text-sm text-gray-500">{user.email}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">{user.no_hp}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatTime(user.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(user)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-2">Tidak ada data ditemukan</p>
                  <p className="text-gray-400 text-sm">
                    Belum ada pengguna yang terdaftar
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}