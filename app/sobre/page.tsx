import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Clock, Calendar, Award, Users, MapPin, Phone, Mail } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sobre a BarberStyle</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Oferecendo serviços de barbearia de alta qualidade desde 2025
        </p>
      </div>

      <div className="relative h-[400px] rounded-lg overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h2 className="text-3xl font-bold mb-4">Tradição e Qualidade</h2>
            <p className="text-xl max-w-2xl">
              Nossa missão é proporcionar a melhor experiência em cuidados masculinos, combinando técnicas tradicionais
              com tendências modernas.
            </p>
          </div>
        </div>
        <Image
          src="https://conteudo.solutudo.com.br/wp-content/uploads/2020/01/BARBEARIA-ARACAJU-BARBEIRO-MESTRE.png"
          alt="Barbearia BarberStyle"
          width={1400}
          height={400}
          className="object-cover"
          priority
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Nossa História</h2>
          <div className="space-y-4">
            <p>
              A BarberStyle nasceu da paixão por proporcionar experiências únicas no cuidado masculino. Fundada em 2010,
              nossa barbearia começou como um pequeno estabelecimento e rapidamente se tornou referência na cidade.
            </p>
            <p>
              Ao longo dos anos, expandimos nossos serviços e instalações, sempre mantendo o compromisso com a qualidade
              e atendimento personalizado que nos tornou conhecidos.
            </p>
            <p>
              Hoje, contamos com uma equipe de profissionais altamente qualificados, prontos para oferecer o melhor em
              cortes de cabelo, barba e tratamentos especiais.
            </p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <Image
            src="https://static.wixstatic.com/media/4c82981e961041ae9b1a50b5895e47ae.jpg/v1/fill/w_640,h_760,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4c82981e961041ae9b1a50b5895e47ae.jpg"
            alt="História da BarberStyle"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excelência</h3>
                <p className="text-muted-foreground">
                  Buscamos a perfeição em cada corte, oferecendo serviços de alta qualidade que superam as expectativas
                  dos nossos clientes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Atendimento</h3>
                <p className="text-muted-foreground">
                  Valorizamos o relacionamento com nossos clientes, oferecendo um atendimento personalizado e acolhedor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inovação</h3>
                <p className="text-muted-foreground">
                  Estamos sempre atualizados com as últimas tendências e técnicas, combinando tradição com modernidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher a BarberStyle?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Profissionais Qualificados</h3>
            <p className="text-muted-foreground">
              Nossa equipe é formada por barbeiros experientes e constantemente treinados.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Horários Flexíveis</h3>
            <p className="text-muted-foreground">Funcionamos em horários convenientes para atender à sua agenda.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Agendamento Online</h3>
            <p className="text-muted-foreground">
              Marque seu horário de forma rápida e prática através do nosso sistema online.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Ambiente Acolhedor</h3>
            <p className="text-muted-foreground">
              Um espaço confortável e moderno para você relaxar enquanto é atendido.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Onde Estamos</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Endereço</h3>
                <p className="text-muted-foreground">Rua dos Barbeiros, 123 - Centro</p>
                <p className="text-muted-foreground">Ribeirão Preto, SP - CEP 01234-567</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Telefone</h3>
                <p className="text-muted-foreground">(16) 99999-9999</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">contato@barberstyle.com</p>
              </div>
            </div>
          </div>

          <Link href="/contato">
            <Button>Entre em Contato</Button>
          </Link>
        </div>

        <div className="rounded-lg overflow-hidden h-[300px] bg-muted flex items-center justify-center">
          <div className="text-center">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.390351157019!2d-47.74085089999999!3d-21.136858299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b9c043ba58b097%3A0x3335482c5728d270!2sR.%20Fernando%20Orlandi%2C%20125%20-%20Parque%20Res.%20Candido%20Portinari%2C%20Ribeir%C3%A3o%20Preto%20-%20SP%2C%2014079-372!5e0!3m2!1spt-BR!2sbr!4v1748380702295!5m2!1spt-BR!2sbr" width="650" height="350" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto para uma experiência única?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Agende seu horário agora e descubra por que somos a barbearia preferida da cidade.
        </p>
        <Link href="/agendamento">
          <Button size="lg">Agendar Agora</Button>
        </Link>
      </div>
    </div>
  )
}
