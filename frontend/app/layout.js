import './globals.css'

export const metadata = {
  title: 'BusQueue',
  description: 'BusQueue Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
