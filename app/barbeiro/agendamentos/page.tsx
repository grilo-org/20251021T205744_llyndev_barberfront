"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, User, AlertTriangle, CheckCircle, DollarSign, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useErrorToast } from "@/hooks/use-error-toast"
import { useAuth } from "@/hooks/use-auth"
import { schedulingApi, servicesApi } from "@/lib/api"
import type { Scheduling, States, BarberService } from "@/lib/types"
import { getPaymentLabel, listServiceNames, sumServicePrice, sumServiceDuration } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BarbeiroAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Scheduling[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAgendamento, setSelectedAgendamento] = useState<Scheduling | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isFinalizarDialogOpen, setIsFinalizarDialogOpen] = useState(false)
  const [isAdicionarServicoDialogOpen, setIsAdicionarServicoDialogOpen] = useState(false)
  const [motivoCancelamento, setMotivoCancelamento] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("MONEY")
  const [observation, setObservation] = useState("")
  const [valorAdicional, setValorAdicional] = useState("")
  const [servicosDisponiveis, setServicosDisponiveis] = useState<BarberService[]>([])
  const [servicosAdicionais, setServicosAdicionais] = useState<{ id: number; quantity: number }[]>([])
  const [filtroStates, setFiltroStates] = useState<string>("todos")
  const [dataFiltro, setDataFiltro] = useState<string>(format(new Date(), "yyyy-MM-dd"))

  const { toast } = useToast()
  const { pushError } = useErrorToast('barbeiro-agendamentos')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "BARBER" && user.role !== "ADMIN") {
      router.push("/")
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      })
      return
    }
    loadAgendamentos()
    loadServicos()
  }, [user, loading, router, toast, filtroStates, dataFiltro])

  const loadAgendamentos = async () => {
    setIsLoading(true)
    try {
      let data
      if (user?.role === "BARBER") {
        data = await schedulingApi.getByBarber()
      } else {
        data = await schedulingApi.getAll()
      }

      if (filtroStates !== "todos") {
        data = data.filter((agendamento: Scheduling) => agendamento.states === filtroStates)
      }

      if (dataFiltro) {
        data = data.filter((agendamento: Scheduling) => {
          const dataAgendamento = format(parseISO(agendamento.dateTime), "yyyy-MM-dd")
          return dataAgendamento === dataFiltro
        })
      }

      setAgendamentos(data)
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar os agendamentos." })
    } finally {
      setIsLoading(false)
    }
  }

  const loadServicos = async () => {
    try {
      const data = await servicesApi.getAll()
      setServicosDisponiveis(data)
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar a lista de serviços." })
    }
  }

  const handleCancelarAgendamento = (agendamento: Scheduling) => {
    setSelectedAgendamento(agendamento)
    setMotivoCancelamento("")
    setIsCancelDialogOpen(true)
  }

  const handleFinalizarAgendamento = (agendamento: Scheduling) => {
    setSelectedAgendamento(agendamento)
    setPaymentMethod("MONEY")
    setObservation("")
    setValorAdicional("")
    setIsFinalizarDialogOpen(true)
  }

  const handleAdicionarServico = (agendamento: Scheduling) => {
    setSelectedAgendamento(agendamento)
    setServicosAdicionais([])
    setIsAdicionarServicoDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedAgendamento || !motivoCancelamento) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo do cancelamento.",
        variant: "destructive",
      })
      return
    }

    try {
      await schedulingApi.cancel(selectedAgendamento.id, motivoCancelamento)

      await loadAgendamentos()

      toast({
        title: "Agendamento cancelado",
        description: "O agendamento foi cancelado com sucesso.",
      })

      setIsCancelDialogOpen(false)
    } catch (error) {
      pushError(error, { description: "Não foi possível cancelar o agendamento." })
    }
  }

  const handleConfirmFinalizar = async () => {
    if (!selectedAgendamento || !paymentMethod) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione o método de pagamento.",
        variant: "destructive",
      })
      return
    }

    try {
      const valorAdic = valorAdicional ? parseFloat(valorAdicional) : 0

      await schedulingApi.finish(selectedAgendamento.id, {
        paymentMethod: paymentMethod as any,
        observation,
        additionalValue: valorAdic
      })

      await loadAgendamentos()

      toast({
        title: "Atendimento finalizado",
        description: "O atendimento foi finalizado com sucesso.",
      })

      setIsFinalizarDialogOpen(false)
      setPaymentMethod("MONEY")
      setObservation("")
      setValorAdicional("")
    } catch (error) {
      pushError(error, { description: "Não foi possível finalizar o atendimento." })
    }
  }

  const handleConfirmAdicionarServico = async () => {
    if (!selectedAgendamento || servicosAdicionais.length === 0) {
      toast({
        title: "Serviços obrigatórios",
        description: "Por favor, selecione pelo menos um serviço adicional.",
        variant: "destructive",
      })
      return
    }

    try {
      await schedulingApi.addServices(selectedAgendamento.id, servicosAdicionais)

      await loadAgendamentos()

      toast({
        title: "Serviços adicionados",
        description: "Os serviços adicionais foram registrados com sucesso.",
      })

      setIsAdicionarServicoDialogOpen(false)
    } catch (error) {
      pushError(error, { description: "Não foi possível adicionar os serviços." })
    }
  }

  const handleAddServico = (servicoId: number) => {
    const existingIndex = servicosAdicionais.findIndex((s) => s.id === servicoId)

    if (existingIndex >= 0) {
      const updatedServicos = [...servicosAdicionais]
      updatedServicos[existingIndex].quantity += 1
      setServicosAdicionais(updatedServicos)
    } else {
      setServicosAdicionais([...servicosAdicionais, { id: servicoId, quantity: 1 }])
    }
  }

  const handleRemoveServico = (servicoId: number) => {
    const existingIndex = servicosAdicionais.findIndex((s) => s.id === servicoId)

    if (existingIndex >= 0) {
      const updatedServicos = [...servicosAdicionais]
      if (updatedServicos[existingIndex].quantity > 1) {
        updatedServicos[existingIndex].quantity -= 1
        setServicosAdicionais(updatedServicos)
      } else {
        setServicosAdicionais(servicosAdicionais.filter((s) => s.id !== servicoId))
      }
    }
  }

  const getStatesBadge = (states: States) => {
    switch (states) {
      case "SCHEDULED":
        return <Badge className="bg-green-500">Agendado</Badge>
      case "CONFIRMED":
        return <Badge className="bg-blue-500">Confirmado</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-900">Concluído</Badge>
      case "CANCELED":
        return <Badge className="bg-red-500">Cancelado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getServicoById = (id: number) => {
    return servicosDisponiveis.find((s) => s.id === id)
  }

  const getGorjeta = (agendamento: Scheduling) => (agendamento.additionalValue ?? 0)

  const calcularTotalServicosAdicionais = () => {
    return servicosAdicionais.reduce((total, servico) => {
      const servicoInfo = getServicoById(servico.id)
      return total + (servicoInfo ? servicoInfo.price * servico.quantity : 0)
    }, 0)
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Meus Atendimentos</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="filtro-states">Filtrar por Status</Label>
          <Select value={filtroStates} onValueChange={setFiltroStates}>
            <SelectTrigger id="filtro-states">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="SCHEDULED">Agendados</SelectItem>
              <SelectItem value="COMPLETED">Concluídos</SelectItem>
              <SelectItem value="CANCELED">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filtro-data">Filtrar por Data</Label>
          <Input id="filtro-data" type="date" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={() => setDataFiltro("")} variant="outline" className="w-full">
            Limpar Filtro de Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista" className="mb-6">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>
        <TabsContent value="lista">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Nenhum agendamento encontrado</h2>
              <p className="mt-2 text-muted-foreground">Você não possui agendamentos para atender no momento.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>{listServiceNames(agendamento).join(', ')}</CardTitle>
                      {getStatesBadge(agendamento.states)}
                    </div>
                    <CardDescription>Agendamento #{agendamento.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Cliente: {agendamento.client.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(agendamento.dateTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(agendamento.dateTime), "HH:mm")}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Duração Total: {sumServiceDuration(agendamento)} minutos</div>
                        <div className="font-medium">Valor Total: R$ {sumServicePrice(agendamento).toFixed(2)}</div>
                        {listServiceNames(agendamento).length > 1 && (
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {(agendamento.barberService || []).map((s:any) => (
                              <div key={s.id}>{s.nameService}: {s.durationInMinutes}min - R$ {s.price.toFixed(2)}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {agendamento.states === "COMPLETED" && (
                        <div
                          className={`mt-2 p-3 rounded-md ${getGorjeta(agendamento) > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-transparent'}`}
                        >
                          <div className="space-y-2">
                            {getGorjeta(agendamento) > 0 && (
                              <div className="flex items-center">
                                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                                <span>Gorjeta: R$ {getGorjeta(agendamento).toFixed(2)}</span>
                              </div>
                            )}
                            {agendamento.totalValue && (
                              <div className="flex items-center font-semibold text-green-700">
                                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                                <span>Valor Total: R$ {agendamento.totalValue.toFixed(2)}</span>
                              </div>
                            )}
                            {agendamento.dateTimeCompletion && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span>Finalizado em: {format(parseISO(agendamento.dateTimeCompletion), "dd/MM/yyyy 'às' HH:mm")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {agendamento.paymentMethod && (
                        <div className="flex items-center mt-2">
                          <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                          <span>Pagamento: {getPaymentLabel(agendamento.paymentMethod)}</span>
                        </div>
                      )}

                      {agendamento.additionalServicesList && agendamento.additionalServicesList.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Serviços adicionais (lista):</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {agendamento.additionalServicesList.map((servico, index) => (
                              <li key={index}>
                                {servico.name} - R$ {servico.price.toFixed(2)} x{servico.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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

                    {agendamento.observation && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <div className="flex items-start">
                          <AlertTriangle className="mr-2 h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-500">Observações:</p>
                            <p className="text-sm text-muted-foreground">{agendamento.observation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {agendamento.states === "SCHEDULED" && (
                      <>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => handleFinalizarAgendamento(agendamento)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Finalizar
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleAdicionarServico(agendamento)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleCancelarAgendamento(agendamento)}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="calendario">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Visualização de calendário em desenvolvimento.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancelar Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>Informe o motivo do cancelamento. O cliente será notificado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="motivo-cancelamento">Motivo do cancelamento</Label>
              <Textarea
                id="motivo-cancelamento"
                placeholder="Informe o motivo do cancelamento"
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalizar Dialog */}
      <Dialog open={isFinalizarDialogOpen} onOpenChange={setIsFinalizarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Atendimento</DialogTitle>
            <DialogDescription>
              Registre o método de pagamento, serviços extras realizados e observações sobre o atendimento concluído.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="metodo-pagamento">Método de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="metodo-pagamento">
                  <SelectValue placeholder="Selecione o método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONEY">Dinheiro</SelectItem>
                  <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="TRANSFER">Transferência Bancária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o atendimento"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valor-adicional">Valor Adicional (R$)</Label>
              <Input
                id="valor-adicional"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={valorAdicional}
                onChange={(e) => setValorAdicional(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Valor adicional cobrado pelos serviços extras
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinalizarDialogOpen(false)}>
              Voltar
            </Button>
            <Button onClick={handleConfirmFinalizar}>Finalizar Atendimento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adicionar Serviço Dialog */}
      <Dialog open={isAdicionarServicoDialogOpen} onOpenChange={setIsAdicionarServicoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Serviços</DialogTitle>
            <DialogDescription>
              Adicione serviços extras solicitados pelo cliente durante o atendimento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Serviços Disponíveis</Label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {servicosDisponiveis.map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{servico.nameService}</p>
                      <p className="text-sm text-muted-foreground">R$ {servico.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveServico(servico.id)}
                        disabled={!servicosAdicionais.some((s) => s.id === servico.id)}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center">
                        {servicosAdicionais.find((s) => s.id === servico.id)?.quantity || 0}
                      </span>
                      <Button variant="outline" size="icon" onClick={() => handleAddServico(servico.id)}>
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {servicosAdicionais.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Resumo</h3>
                <ul className="space-y-1 mb-2">
                  {servicosAdicionais.map((servico) => {
                    const servicoInfo = getServicoById(servico.id)
                    return servicoInfo ? (
                      <li key={servico.id} className="flex justify-between">
                        <span>
                          {servicoInfo.nameService} x{servico.quantity}
                        </span>
                        <span>R$ {(servicoInfo.price * servico.quantity).toFixed(2)}</span>
                      </li>
                    ) : null
                  })}
                </ul>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total:</span>
                  <span>R$ {calcularTotalServicosAdicionais().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdicionarServicoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmAdicionarServico} disabled={servicosAdicionais.length === 0}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
