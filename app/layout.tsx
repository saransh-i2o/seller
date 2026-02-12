import React from "react"
import type { Metadata } from 'next'
import { Source_Sans_3, Merriweather } from 'next/font/google'

import './globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
})
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: 'Seller Investigation Report | i2o',
  description: 'Comprehensive seller investigation report powered by i2o Technologies',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${merriweather.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
