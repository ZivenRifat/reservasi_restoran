// src/app/Restoran/dashboard/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType; // Menggunakan React.ElementType untuk komponen ikon
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;