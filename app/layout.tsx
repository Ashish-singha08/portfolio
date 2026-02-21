import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Lora, Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ashishsinghal.dev'),
  title: 'Ashish Singhal — AI & Backend Engineer',
  description: 'Building AI Agents & Intelligent Systems. Portfolio of Ashish Singhal — AI, backend engineering, and automation.',
  
}

export const viewport: Viewport = {
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeScript = `
    (function() {
      try {
        var t = localStorage.getItem('theme');
        if (t === 'light' || t === 'sepia') {
          document.documentElement.classList.add(t);
        }
      } catch(e) {}
    })();
  `

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${lora.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
