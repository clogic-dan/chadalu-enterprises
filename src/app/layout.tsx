import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CHADALU Enterprises - Building Equipment Hire',
  description: 'Professional building equipment hire services in Ruiru, Kiambu County, Kenya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}