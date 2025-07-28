import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Chiang Mai Used Car',
  description: 'Find quality used cars in Chiang Mai',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
