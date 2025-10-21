"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, Scissors, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useErrorToast } from "@/hooks/use-error-toast"
import { schedulingApi } from "@/lib/api"
import type { Scheduling, States } from "@/lib/types"
import { listServiceNames, sumServiceDuration, sumServicePrice } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function MeusAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Scheduling[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAgendamento, setSelectedAgendamento] = useState<Scheduling | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { user, loading: isAuthLoading } = useAuth()
  const isAuthenticated = !!user
  const { toast } = useToast()
  const { pushError } = useErrorToast('meus-agendamentos')
  const router = useRouter()
  

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    loadAgendamentos()
  }, [isAuthLoading, isAuthenticated, router])

  const loadAgendamentos = async () => {
    setIsLoading(true)
    try {
      const data = await schedulingApi.getByClient()
      const scheduledAgendamentos = data.filter(agendamento => agendamento.states === "SCHEDULED")
      setAgendamentos(scheduledAgendamentos)
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar seus agendamentos." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAgendamento = (agendamento: Scheduling) => {
    setSelectedAgendamento(agendamento)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedAgendamento) return

    try {
      await schedulingApi.delete(selectedAgendamento.id)

      setAgendamentos(agendamentos.filter((a) => a.id !== selectedAgendamento.id))

      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      pushError(error, { description: "Não foi possível cancelar o agendamento." })
    }
  }

  const canCancelAppointment = (agendamento: Scheduling) => {
    return agendamento.states === "SCHEDULED"
  }


  const getStatesBadge = (status: States) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge className="bg-green-500">Agendado</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-900">Concluído</Badge>
      case "CANCELED":
        return <Badge className="bg-red-500">Cancelado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Meus Agendamentos Ativos</h1>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Calendar className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Nenhum agendamento ativo</h2>
          <p className="mt-2 text-muted-foreground">
            Você não possui agendamentos ativos no momento. Que tal agendar um corte agora?
          </p>
          <Button className="mt-4" onClick={() => router.push("/agendamento")}>
            Agendar Corte
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agendamentos.map((agendamento) => {
            const totalDuration = sumServiceDuration(agendamento)
            const totalPrice = sumServicePrice(agendamento)
            const services = (agendamento as any).barberService || (agendamento as any).services || []
            return (
              <Card key={agendamento.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>{listServiceNames(agendamento).join(', ')}</CardTitle>
                  {getStatesBadge(agendamento.states)}
                </div>
                <CardDescription>Com {agendamento.barber.name}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(parseISO(agendamento.dateTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(parseISO(agendamento.dateTime), "HH:mm")}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {services.map((s: any) => (
                      <div key={s.id} className="flex items-center">
                        <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{s.nameService} - {s.durationInMinutes}min - R$ {(s.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex items-center mt-1">
                      <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total: {totalDuration} min - R$ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {agendamento.reason && (
                  <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-500">Motivo do cancelamento:</p>
                        <p className="text-sm text-muted-foreground">{agendamento.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
              <CardFooter>
                {agendamento.states === "SCHEDULED" && (
                  <div className="flex gap-2 w-full">
                    {canCancelAppointment(agendamento) ? (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleCancelAgendamento(agendamento)}
                      >
                        Cancelar
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        Não é possível cancelar
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          )})}
        </div>
      )}

      {/* Confirm Cancel Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>Confirmar Cancelamento</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
