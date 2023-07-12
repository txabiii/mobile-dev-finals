import './globals.scss'
import type { Metadata } from 'next'
import { Inter, Barlow, Rajdhani } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-barlow',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-rajdhani',
})

export const metadata: Metadata = {
  title: 'Plant Parenthood',
  description: 'Showcases the mobile app Plant Parenthood',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${barlow.variable} ${rajdhani.variable}`}>{children}</body>
    </html>
  )
}
