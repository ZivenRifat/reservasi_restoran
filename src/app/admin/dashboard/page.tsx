'use client';

import { useState } from 'react';
import { NewRestaurant } from "@/app/admin/dashboard/components/NewRestaurants";
import { NewUsers } from "@/app/admin/dashboard/components/NewUsers";

export default function Page() {
  const token = 'YCXYVZHkCUCc9xNZsOU19q5FqxfQ8oKA3bHLhAoR1e10ab98';

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Statistik Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Pelanggan Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 ease-out">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-2 group-hover:bg-white/30 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            
            <h3 className="text-sm font-medium text-white/90 mb-1">Total Pelanggan</h3>
            <p className="text-2xl font-bold text-white mb-1">{totalUsers.toLocaleString('id-ID')}</p>
            <div className="flex items-center text-white/80 text-xs">
              <svg className="w-3 h-3 mr-1 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              Aktif terdaftar
            </div>
          </div>
        </div>

        {/* Total Restoran Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 ease-out">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mb-2 group-hover:bg-white/30 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <h3 className="text-sm font-medium text-white/90 mb-1">Total Restoran</h3>
            <p className="text-2xl font-bold text-white mb-1">{totalRestaurants.toLocaleString('id-ID')}</p>
            <div className="flex items-center text-white/80 text-xs">
              <svg className="w-3 h-3 mr-1 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              Mitra bergabung
            </div>
          </div>
        </div>
      </div>

      {/* Dua Tabel Sampingan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <NewRestaurant token={token} onTotalChange={setTotalRestaurants} limit={5} />
        </div>
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <NewUsers token={token} onTotalChange={setTotalUsers} />
        </div>
      </div>
    </div>
  );
}