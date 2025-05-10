// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Reservasia',
  description: 'Cari restoran favorit kamu!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-black">{children}</body>
    </html>
  )
}
