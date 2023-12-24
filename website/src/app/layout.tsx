import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solarpunk Drifters',
  description: 'Solarpunk Drifters website'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <Providers>
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  )
}
