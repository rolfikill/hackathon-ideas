import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hackathon Ideas',
  description: 'Ideen für den Hackathon einreichen, liken und kommentieren',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${geist.className} bg-slate-50 min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
