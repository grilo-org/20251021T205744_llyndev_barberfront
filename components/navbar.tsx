"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Scissors, User, LogIn, LogOut, Calendar, Users, Settings, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { ModeToggle } from "./mode-toggle"

const STORAGE_KEY = "barbershop_sobre_conteudo"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  useEffect(() => {
  }, [user, loading])
  const [isOpen, setIsOpen] = useState(false)
  const [nomeBarbearia, setNomeBarbearia] = useState("BarberStyle")

  useEffect(() => {
    const loadBarbershopName = () => {
      try {
        if (typeof window !== "undefined") {
          const savedData = localStorage.getItem(STORAGE_KEY)
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (parsedData.nomeBarbearia) {
              setNomeBarbearia(parsedData.nomeBarbearia)
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar nome da barbearia:", error)
      }
    }


    loadBarbershopName()

    // Adicionar um event listener para detectar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadBarbershopName()
      }
    }

    // Registrar o event listener
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }

    // Limpar o event listener quando o componente for desmontado
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Sobre", href: "/sobre" }
  ]

  const getAuthLinks = () => {
    if (loading) return []

    if (!user) {
      return [
        { name: "Entrar", href: "/login", icon: LogIn },
        { name: "Registrar", href: "/register", icon: User },
      ]
    }

    const links = [{ name: "Perfil", href: "/perfil", icon: User }]

    // Links específicos para cada tipo de usuário
    if (user.role === "CLIENT") {
      links.unshift(
        { name: "Agendar", href: "/agendamento", icon: Calendar },
        { name: "Meus Agendamentos", href: "/meus-agendamentos", icon: Calendar },
      )
    } else if (user.role === "BARBER") {
      links.unshift({ name: "Meus Atendimentos", href: "/barbeiro/agendamentos", icon: Calendar })
    } else if (user.role === "ADMIN") {
      links.unshift(
        { name: "Usuários", href: "/admin/usuarios", icon: Users },
        { name: "Serviços", href: "/admin/servicos", icon: Settings },
        { name: "Horarios", href: "/admin/configuracoes", icon: Clock },
      )
    }

    return links
  }

  const authLinks = getAuthLinks()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          <span className="text-xl font-bold">BarberStyle</span>
        </Link>

        <nav className="ml-10 hidden md:flex md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />

          <div className="hidden md:flex md:gap-2">
            {!loading &&
              (user ? (
                <>
                  {authLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <link.icon className="h-4 w-4" />
                        {link.name}
                      </Button>
                    </Link>
                  ))}
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      Registrar
                    </Button>
                  </Link>
                </>
              ))}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium ${isActive(link.href) ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="my-2 h-px w-full bg-border" />
                {!loading &&
                  (user ? (
                    <>
                      {authLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-2 text-lg font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <link.icon className="h-5 w-5" />
                          {link.name}
                        </Link>
                      ))}
                      <button
                        className="flex items-center gap-2 text-lg font-medium text-red-500"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        Entrar
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Registrar
                      </Link>
                    </>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
