import Link from "next/link"
import { Scissors } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              <span className="text-lg font-bold">BarberStyle</span>
            </Link>
            <p className="text-sm text-muted-foreground">Oferecendo os melhores serviços de barbearia desde 2025.</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/agendamento" className="text-muted-foreground hover:text-foreground">
                  Agendar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <p className="text-sm text-muted-foreground">Corte de Cabelo</p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground">Barba</p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground">Tratamento</p>
              </li>
              <li>
                <p className="text-sm text-muted-foreground">Produtos</p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contato</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground">Rua dos Barbeiros, 123</p>
              <p className="text-sm text-muted-foreground">Ribeirão Preto, SP</p>
              <p className="text-sm text-muted-foreground">contato@barberstyle.com</p>
              <p className="text-sm text-muted-foreground">(16) 99999-9999</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BarberStyle. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
