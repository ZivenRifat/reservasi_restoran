'use client'; // Pastikan ini ada karena menggunakan hooks Next.js

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface MenuItemProps {
  label: string;
  href: string;
  icon: React.ReactNode; // Menggunakan React.ReactNode untuk SVG icon
}

export default function MenuItem({ label, href, icon }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
        isActive
          ? 'bg-[#6a1b1b] shadow-md border-l-4 border-white' // Gaya aktif
          : 'hover:bg-[#6a1b1b] hover:shadow-sm hover:translate-x-1' // Gaya hover
      }`}
    >
      <span
        className={`transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
        }`}
      >
        {icon}
      </span>
      <span
        className={`font-medium transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-gray-100 group-hover:text-white'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}