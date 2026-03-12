import '../styles/globals.css'
import type { Metadata } from 'next'
import { Prompt, Noto_Sans_Thai } from 'next/font/google'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-thai',
})

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-prompt',
})

export const metadata: Metadata = {
  title: 'ประเมินราคากลางรถมือสองมาตรฐานประเทศไทย',
  description: 'เครื่องมือวิเคราะห์ทิศทางราคาและพยากรณ์กำไรอัจฉริยะ โดย ครูหนึ่งรถสวย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${prompt.variable}`}>
      <body className="font-thai antialiased">{children}</body>
    </html>
  )
}
