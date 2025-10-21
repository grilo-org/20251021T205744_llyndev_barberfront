"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { servicesApi } from "@/lib/api"
import type { BarberService } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"

export default function ServicosPage() {
  const [servicos, setServicos] = useState<BarberService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedServico, setSelectedServico] = useState<BarberService | null>(null)
  const [formData, setFormData] = useState({
    nameService: "",
    description: "",
    price: 0,
    durationInMinutes: 0,
  })

  const { toast } = useToast()
  const { pushError } = useErrorToast('admin-servicos')
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
    loadServicos()
  }, [user, loading, router, toast])

  const loadServicos = async () => {
    setIsLoading(true)
    try {
  const data = await servicesApi.getAll()
      setServicos(data)
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar a lista de serviços." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddServico = () => {
    setFormData({
      nameService: "",
      description: "",
      price: 0,
      durationInMinutes: 0,
    })
    setIsAddDialogOpen(true)
  }

  const handleEditServico = (servico: BarberService) => {
    setSelectedServico(servico)
    setFormData({
      nameService: servico.nameService,
      description: servico.description,
      price: servico.price,
      durationInMinutes: servico.durationInMinutes,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteServico = (servico: BarberService) => {
    setSelectedServico(servico)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveServico = async () => {
    if (!formData.nameService || !formData.description || formData.price <= 0 || formData.durationInMinutes <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
  if (isAddDialogOpen) {
    const newServico = await servicesApi.create(formData)
        setServicos([...servicos, newServico])
        toast({
          title: "Serviço adicionado",
          description: `${newServico.nameService} foi adicionado com sucesso.`,
        })
        setIsAddDialogOpen(false)
  } else if (isEditDialogOpen && selectedServico) {
  const updatedServico = await servicesApi.update(selectedServico.id, formData)
        const updatedServicos = servicos.map((s) => (s.id === selectedServico.id ? updatedServico : s))
        setServicos(updatedServicos)
        toast({
          title: "Serviço atualizado",
          description: `${updatedServico.nameService} foi atualizado com sucesso.`,
        })
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      pushError(error, { description: "Não foi possível salvar as alterações." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedServico) return

    setIsLoading(true)

    try {
  await servicesApi.delete(selectedServico.id)
      const filteredServicos = servicos.filter((s) => s.id !== selectedServico.id)
      setServicos(filteredServicos)
      toast({
        title: "Serviço removido",
        description: `${selectedServico.nameService} foi removido com sucesso.`,
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      pushError(error, { description: "Não foi possível excluir o serviço." })
    } finally {
      setIsLoading(false)
    }
  }

  if (typeof window !== "undefined" && (!user || user.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Serviços</h1>
        <Button onClick={handleAddServico}>Adicionar Serviço</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
          <CardDescription>Gerencie os serviços oferecidos pela barbearia</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Duração (min)</TableHead>
                  <TableHead>Preço (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicos.map((servico) => (
                  <TableRow key={servico.id}>
                    <TableCell className="font-medium">{servico.nameService}</TableCell>
                    <TableCell>{servico.description}</TableCell>
                    <TableCell>{servico.durationInMinutes}</TableCell>
                    <TableCell>{servico.price ? servico.price.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditServico(servico)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteServico(servico)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>Preencha os dados para adicionar um novo serviço.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.nameService}
                onChange={(e) => setFormData({ ...formData, nameService: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.durationInMinutes}
                onChange={(e) => setFormData({ ...formData, durationInMinutes: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveServico} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>Atualize os dados do serviço.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={formData.nameService}
                onChange={(e) => setFormData({ ...formData, nameService: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Textarea
                id="edit-descricao"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duracao">Duração (minutos)</Label>
              <Input
                id="edit-duracao"
                type="number"
                min="1"
                value={formData.durationInMinutes}
                onChange={(e) => 
                  setFormData({ ...formData, 
                  durationInMinutes: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Preço (R$)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveServico} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o serviço {selectedServico?.nameService}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isLoading}>
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
