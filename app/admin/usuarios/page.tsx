"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Scissors, Trash, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { usersApi } from "@/lib/api"
import type { User, Role } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    senha: "",
    role: "CLIENT" as Role,
  })

  const { toast } = useToast()
  const { pushError } = useErrorToast('admin-usuarios')
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
    loadUsers()
  }, [user, loading, router, toast])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (error) {
      pushError(error, { description: "Não foi possível carregar a lista de usuários." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      telephone: "",
      senha: "",
      role: "CLIENT",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      senha: "",
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email || !formData.telephone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isAddDialogOpen) {
        if (!formData.senha) {
          toast({
            title: "Senha obrigatória",
            description: "Por favor, defina uma senha para o novo usuário.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        const newUser = await usersApi.create(formData)
        setUsers([...users, newUser])
        toast({
          title: "Usuário adicionado",
          description: `${newUser.name} foi adicionado com sucesso.`,
        })
        setIsAddDialogOpen(false)
      } else if (isEditDialogOpen && selectedUser) {
        const updatedUser = await usersApi.update(selectedUser.id, formData)
        const updatedUsers = users.map((u) => (u.id === selectedUser.id ? updatedUser : u))
        setUsers(updatedUsers)
        toast({
          title: "Usuário atualizado",
          description: `${updatedUser.name} foi atualizado com sucesso.`,
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
    if (!selectedUser) return

    setIsLoading(true)

    try {
      await usersApi.delete(selectedUser.id)
      const filteredUsers = users.filter((u) => u.id !== selectedUser.id)
      setUsers(filteredUsers)
      toast({
        title: "Usuário removido",
        description: `${selectedUser.name} foi removido com sucesso.`,
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      pushError(error, { description: "Não foi possível excluir o usuário." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: number, newRole: Role) => {
    try {
      const updatedUser = await usersApi.updateRole(userId, newRole)
      const updatedUsers = users.map((user) => (user.id === userId ? updatedUser : user))
      setUsers(updatedUsers)

      toast({
        title: "Função atualizada",
        description: `A função do usuário foi atualizada para ${newRole}.`,
      })
    } catch (error) {
      pushError(error, { description: "Não foi possível atualizar a função do usuário." })
    }
  }

  if (typeof window !== "undefined" && (!user || user.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={handleAddUser}>Adicionar Usuário</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie os usuários do sistema e suas funções</CardDescription>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone}</TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(value: Role) => handleRoleChange(user.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4" />
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="BARBER">
                            <div className="flex items-center gap-2">
                              <Scissors className="h-4 w-4" />
                              <span>Barbeiro</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="CLIENT">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4" />
                              <span>Cliente</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteUser(user)}
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
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>Preencha os dados para adicionar um novo usuário ao sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telephone">Telefone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select value={formData.role} onValueChange={(value: Role) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="BARBEIRO">Barbeiro</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize os dados do usuário.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-telephone">Telefone</Label>
              <Input
                id="edit-telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-senha">Senha (deixe em branco para manter a atual)</Label>
              <Input
                id="edit-senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Função</Label>
              <Select value={formData.role} onValueChange={(value: Role) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="BARBEIRO">Barbeiro</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} disabled={isLoading}>
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
              Tem certeza que deseja excluir o usuário {selectedUser?.name}? Esta ação não pode ser desfeita.
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
