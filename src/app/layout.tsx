import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eco Porter',
  description: 'Transporting you to your next destination',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
