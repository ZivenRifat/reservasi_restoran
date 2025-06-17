// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: 'Reservasia',
  description: 'Cari restoran favorit kamu!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-black">
        <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  )
}
