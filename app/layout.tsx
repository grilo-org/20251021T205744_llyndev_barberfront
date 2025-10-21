import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import ClientOnly from "@/components/client-only"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BarberStyle - BarberShop",
  description: 'Agende seu corte de cabelo com os melhores barbeiros da cidade',
}

export default function RootLayout({
  children,
}: Readonly <{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientOnly>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar/>
                <main className="flex-1">{children}</main>
                <Footer/>
                <Toaster/>
              </div>
            </AuthProvider>
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  )

}
