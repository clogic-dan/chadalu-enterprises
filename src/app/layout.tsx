import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './auth-provider'

export const metadata: Metadata = {
  title: 'CHADALU Enterprises - Building Equipment Hire',
  description: 'Professional building equipment hire services in Ruiru, Kiambu County, Kenya',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}