import { Button } from "@/components/ui/button"
import { Scissors, Clock, Calendar, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
    return (
        <div className="flex flex-col">
            <section className="relative h-[600px] w-full">
                <Image
                    src="https://conteudo.solutudo.com.br/wp-content/uploads/2020/01/BARBEARIA-ARACAJU-BARBEIRO-MESTRE.png"
                    alt="Barbershop"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">BarberStyle</h1>
                    <p className="mb-8 max-w-2xl text-xl">
                        Experimente o melhor em cortes de cabelo e barba com nossos barbeiros profissionais
                    </p>
                    <Link href="/agendamento">
                        <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                            Agendar agora
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold">Nossos Serviços</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <Scissors className="h-8 w-8 text-amber-600"/>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Corte de Cabelo</h3>
                            <p className="text-muted-foreground">
                                Cortes modernos e clássicos realizados por profissionais experientes.
                            </p>
                        </div>
                            <div className="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <Scissors className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Barba</h3>
                            <p className="text-muted-foreground">
                                Modelagem e aparamento de barba com técnicas tradicionais e modernas.
                            </p>
                        </div>
                        <div className="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <Scissors className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Tratamentos</h3>
                            <p className="text-muted-foreground">
                                Hidratação, relaxamento e outros tratamentos para cabelo e barba.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-16 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold">
                        Por que Nos Escolher
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-amber-100 p-3">
                                <Star className="h-6 w-6 text-amber-600"/>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Profissionais Qualificados
                            </h3>
                            <p className="text-muted-foreground">
                                Nossa equipe é formada por barbeiros com anos de experiências e treinamento.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-amber-100 p-3">
                                <Clock className="h-6 w-6 text-amber-600"/>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Agendamento Fácil
                            </h3>
                            <p className="text-muted-foreground">
                                Agende seu horário online de forma rápida e conveniente.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-amber-100 p-3">
                                <Calendar className="h-6 w-6 text-amber-600"/>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Ambiente Confortável
                            </h3>
                            <p className="text-muted-foreground">
                                Um espaço moderno e acolhedor para você relaxar enquanto é atendido.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-amber-600 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold">
                        Pronto para um novo visual?
                    </h2>
                    <p className="mb-8 text-xl">
                        Agende seu horário agora e experimente o melhor serviço de barbearia da cidade.
                    </p>
                    <Link href="/agendamento">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                            Agendar Agora
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}