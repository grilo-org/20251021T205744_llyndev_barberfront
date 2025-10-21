"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Calendar, Save, Plus, Trash2, AlertTriangle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useErrorToast } from "@/hooks/use-error-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { weeklyScheduleApi, specificDateApi } from "@/lib/api"
import type { WeeklySchedule, SpecificDate, DayOfWeek } from "@/lib/types"

const allDays: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const dayNames: Record<DayOfWeek, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
}

export default function ConfiguracoesPage() {
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([])
  const [originalWeeklySchedules, setOriginalWeeklySchedules] = useState<WeeklySchedule[]>([])
  const [specificDates, setSpecificDates] = useState<SpecificDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasWeeklyChanges, setHasWeeklyChanges] = useState(false)
  const [isAddSpecificDateDialogOpen, setIsAddSpecificDateDialogOpen] = useState(false)
  const [isEditSpecificDateDialogOpen, setIsEditSpecificDateDialogOpen] = useState(false)
  const [isDeleteSpecificDateDialogOpen, setIsDeleteSpecificDateDialogOpen] = useState(false)
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<SpecificDate | null>(null)
  const [specificDateForm, setSpecificDateForm] = useState<SpecificDate>({
    specificDate: "",
    openTime: "",
    closeTime: "",
    active: true,
    typeRule: 'SPECIFIC_DATE'
  })


  const { toast } = useToast()
  const { pushError } = useErrorToast('admin-configuracoes')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "ADMIN") {
      router.push("/")
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      })
      return
    }
    loadData()
  }, [user, loading, router, toast])

  useEffect(() => {
    if (originalWeeklySchedules.length > 0 && weeklySchedules.length > 0) {
      const hasChanges = weeklySchedules.some((schedule, index) => {
        const original = originalWeeklySchedules[index]
        return (
          schedule.active !== original.active ||
          schedule.openTime !== original.openTime ||
          schedule.closeTime !== original.closeTime
        )
      })
      setHasWeeklyChanges(hasChanges)
    }
  }, [weeklySchedules, originalWeeklySchedules])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [weeklyData, businessData] = await Promise.all([
        weeklyScheduleApi.getAll(),
        specificDateApi.getAll(),
      ])

      const existingDays = weeklyData.map((ws: WeeklySchedule) => ws.dayOfWeek)
      const missingDays = allDays.filter((day) => !existingDays.includes(day))

      const fullWeeklySchedule: WeeklySchedule[] = [
        ...weeklyData,
        ...missingDays.map((day) => ({
          id: undefined,
          typeRule: 'RECURRING',
          specificDate: null,
          dayOfWeek: day,
          openTime: "09:00",
          closeTime: "18:00",
          active: false,
        } as WeeklySchedule)),
      ].sort((a, b) => {
        const dayOrder = allDays.indexOf(a.dayOfWeek) - allDays.indexOf(b.dayOfWeek)
        return dayOrder
      })

      setWeeklySchedules(fullWeeklySchedule)
      setOriginalWeeklySchedules(JSON.parse(JSON.stringify(fullWeeklySchedule)))

      if (process.env.NODE_ENV !== 'production') {
        // Debug log
      }
      
      const normalizedBusiness = (businessData || []).map((b: any) => {
        const rawDate = b.specificDate
        let normalizedDate = ''
        if (typeof rawDate === 'string' && rawDate.length > 0) {
          normalizedDate = rawDate.split('T')[0] // remove parte de tempo se houver
        } else if (rawDate instanceof Date) {
          normalizedDate = rawDate.toISOString().split('T')[0]
        }
        return {
          id: b.id,
          specificDate: normalizedDate,
          openTime: b.openTime || '',
          closeTime: b.closeTime || '',
          active: b.active ?? true,
          typeRule: b.typeRule,
        }
      })
      setSpecificDates(normalizedBusiness as SpecificDate[])
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar as configurações de horário." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWeeklyScheduleChange = (index: number, field: keyof WeeklySchedule, value: any) => {
    const updatedSchedules = [...weeklySchedules]
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value }
    setWeeklySchedules(updatedSchedules)
  }

  const handleSaveAllWeeklySchedules = async () => {
    setIsSaving(true)
    try {
      const payload: WeeklySchedule[] = weeklySchedules.map(schedule => ({
        ...schedule,
        typeRule: 'RECURRING',
        specificDate: null,
      }))
      
      await weeklyScheduleApi.upsert(payload)
      toast({
        title: "Horários salvos",
        description: "O horário semanal foi atualizado com sucesso.",
      })
      await loadData()
    } catch (error) {
      pushError(error, { description: "Não foi possível salvar os horários." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSpecificDate = () => {
    setSpecificDateForm({
      specificDate: "",
      active: true,
      openTime: "",
      closeTime: "",
      typeRule: 'SPECIFIC_DATE'
    })
    setIsAddSpecificDateDialogOpen(true)
  }

  const handleEditSpecificDate = (specificDate: SpecificDate) => {
    setSelectedSpecificDate(specificDate)
    setSpecificDateForm({
      ...specificDate,
    })
    setIsEditSpecificDateDialogOpen(true)
  }

  const handleDeleteSpecificDate = (specificDate: SpecificDate) => {
    setSelectedSpecificDate(specificDate)
    setIsDeleteSpecificDateDialogOpen(true)
  }

  const handleSaveSpecificDate = async () => {
    if (!specificDateForm.specificDate) {
      toast({
        title: "Campo obrigatório",
        description: "Data é obrigatória.",
        variant: "destructive",
      })
      return
    }
    if (specificDateForm.active && (!specificDateForm.openTime || !specificDateForm.closeTime)) {
      toast({
        title: "Campos obrigatórios",
        description: "Defina abertura e fechamento para marcar como ativo.",
        variant: "destructive",
      })
      return
    }
    const payload: SpecificDate = {
      typeRule: 'SPECIFIC_DATE',
      specificDate: specificDateForm.specificDate,
      active: specificDateForm.active,
      openTime: specificDateForm.active ? specificDateForm.openTime : null,
      closeTime: specificDateForm.active ? specificDateForm.closeTime : null,
      id: selectedSpecificDate?.id,
    }
    try {
      if (selectedSpecificDate && selectedSpecificDate.id) {
        await specificDateApi.update(selectedSpecificDate.id, payload)
        toast({ title: "Horário específico atualizado", description: "A data específica foi atualizada." })
      } else {
        await specificDateApi.create(payload)
        toast({ title: "Horário específico criado", description: "A data específica foi cadastrada." })
      }
      setIsAddSpecificDateDialogOpen(false)
      setIsEditSpecificDateDialogOpen(false)
      setSelectedSpecificDate(null)
      setSpecificDateForm({
        specificDate: "",
        openTime: "",
        closeTime: "",
        active: true,
        typeRule: 'SPECIFIC_DATE'
      })
      await loadData()
    } catch (error) {
      console.error("Erro ao salvar horário específico:", error)
      toast({ title: "Erro", description: "Não foi possível salvar a data específica.", variant: "destructive" })
    }
  }

  const handleConfirmDeleteSpecificDate = async () => {
    if (!selectedSpecificDate || !selectedSpecificDate.id) return
    try {
      await specificDateApi.delete(selectedSpecificDate.id)
      toast({ title: "Horário excluído", description: "O horário especial foi excluído com sucesso." })
      setIsDeleteSpecificDateDialogOpen(false)
      setSelectedSpecificDate(null)
      await loadData()
    } catch (error) {
      console.error("Erro ao excluir horário especial:", error)
      toast({ title: "Erro", description: "Não foi possível excluir o horário especial.", variant: "destructive" })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  if (typeof window !== "undefined" && (!user || user.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Configurações de Horário</h1>

    <Tabs defaultValue="weekly">
      <TabsList className="mb-6">
        <TabsTrigger value="weekly">Horário Semanal</TabsTrigger>
        <TabsTrigger value="special">Horários Especiais</TabsTrigger>
      </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Horário de Funcionamento Semanal</CardTitle>
                <CardDescription>Configure os horários de funcionamento para cada dia da semana</CardDescription>
              </div>
              <Button
                onClick={handleSaveAllWeeklySchedules}
                disabled={!hasWeeklyChanges || isSaving}
                className={!hasWeeklyChanges ? "opacity-50" : ""}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Todos os Horários"}
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {weeklySchedules.map((schedule, index) => (
                    <div key={schedule.dayOfWeek} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium">{dayNames[schedule.dayOfWeek]}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={schedule.active}
                            onCheckedChange={(checked) => handleWeeklyScheduleChange(index, "active", checked)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {schedule.active ? "Aberto" : "Fechado"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`open-time-${index}`}>Horário de Abertura</Label>
                          <Input
                            id={`open-time-${index}`}
                            type="time"
                            value={schedule.openTime ?? ""}
                            onChange={(e) => handleWeeklyScheduleChange(index, "openTime", e.target.value)}
                            disabled={!schedule.active}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`close-time-${index}`}>Horário de Fechamento</Label>
                          <Input
                            id={`close-time-${index}`}
                            type="time"
                            value={schedule.closeTime ?? ""}
                            onChange={(e) => handleWeeklyScheduleChange(index, "closeTime", e.target.value)}
                            disabled={!schedule.active}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-6 border-t flex justify-end">
              <Button
                onClick={handleSaveAllWeeklySchedules}
                disabled={!hasWeeklyChanges || isSaving}
                size="lg"
                className={!hasWeeklyChanges ? "opacity-50" : ""}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Todos os Horários"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="special">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dias Específicos</CardTitle>
                <CardDescription>Configure horários de funcionamento para dias específicos </CardDescription>
              </div>
              <Button onClick={handleAddSpecificDate}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : specificDates.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum dia específico configurado</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione dias específicos.
                  </p>
                  <Button onClick={handleAddSpecificDate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Horário Especifíco
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {specificDates.map((specificDate, idx) => (
                    <Card key={specificDate.id ?? idx} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {specificDate.specificDate ? formatDate(specificDate.specificDate) : `Data não informada${process.env.NODE_ENV !== 'production' ? ' (#'+idx+')' : ''}`}
                          </CardTitle>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              specificDate.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {specificDate.active ? "Ativo" : "Inativo"}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {specificDate.active ? (
                              <span>
                                Horário: {specificDate.openTime || '--:--'} - {specificDate.closeTime || '--:--'}
                              </span>
                            ) : (
                              <span>Fechado</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditSpecificDate(specificDate)}>
                            <Pencil className="h-4 w-4" />
                            <span className="ml-1">Editar</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSpecificDate(specificDate)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="ml-1">Excluir</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Add Specific Date Dialog */}
      <Dialog open={isAddSpecificDateDialogOpen} onOpenChange={setIsAddSpecificDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Data Específica</DialogTitle>
            <DialogDescription>Defina horário de funcionamento para uma data específica (sobrepõe o semanal).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={specificDateForm.specificDate}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, specificDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="open-time">Horário de Abertura</Label>
                <Input
                  id="open-time"
                  type="time"
                  disabled={!specificDateForm.active}
                  className={!specificDateForm.active ? 'opacity-50 cursor-not-allowed' : ''}
                  value={specificDateForm.openTime ?? ""}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, openTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="close-time">Horário de Fechamento</Label>
                <Input
                  id="close-time"
                  type="time"
                  disabled={!specificDateForm.active}
                  className={!specificDateForm.active ? 'opacity-50 cursor-not-allowed' : ''}
                  value={specificDateForm.closeTime ?? ""}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, closeTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={specificDateForm.active}
                onCheckedChange={(checked) => setSpecificDateForm({ ...specificDateForm, active: checked })}
              />
              <Label htmlFor="active">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSpecificDateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSpecificDate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Specific Date Dialog */}
      <Dialog open={isEditSpecificDateDialogOpen} onOpenChange={setIsEditSpecificDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Data Específica</DialogTitle>
            <DialogDescription>Atualize o horário desta data específica.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Data</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={specificDateForm.specificDate}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, specificDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-open-time">Horário de Abertura</Label>
                <Input
                  id="edit-open-time"
                  type="time"
                  disabled={!specificDateForm.active}
                  className={!specificDateForm.active ? 'opacity-50 cursor-not-allowed' : ''}
                  value={specificDateForm.openTime ?? ""}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, openTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-close-time">Horário de Fechamento</Label>
                <Input
                  id="edit-close-time"
                  type="time"
                  disabled={!specificDateForm.active}
                  className={!specificDateForm.active ? 'opacity-50 cursor-not-allowed' : ''}
                  value={specificDateForm.closeTime ?? ""}
                  onChange={(e) => setSpecificDateForm({ ...specificDateForm, closeTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={specificDateForm.active}
                onCheckedChange={(checked) => setSpecificDateForm({ ...specificDateForm, active: checked })}
              />
              <Label htmlFor="edit-active">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSpecificDateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSpecificDate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Specific Date Dialog */}
      <AlertDialog open={isDeleteSpecificDateDialogOpen} onOpenChange={setIsDeleteSpecificDateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este dia especifíco? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteSpecificDate}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
