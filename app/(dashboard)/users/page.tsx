"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Ban,
  CheckCircle,
  Shield,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/src/services/api"
import { useDebounce } from "@/src/hooks/useDebounce"
import { PAGINATION } from "@/src/lib/constants"
import { formatDate } from "@/src/utils/formatters"

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("pagination[page]", String(page))
      params.set("pagination[pageSize]", String(PAGINATION.DEFAULT_PAGE_SIZE))
      params.set("sort[0]", "username:asc")
      params.set("populate", "role")
      if (debouncedSearch) {
        params.set("filters[$or][0][username][$containsi]", debouncedSearch)
        params.set("filters[$or][1][email][$containsi]", debouncedSearch)
      }
      const response = await api.get(`/users?${params.toString()}`)
      return response.data
    },
  })

  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, blocked }: { id: number; blocked: boolean }) => {
      await api.put(`/users/${id}`, { blocked })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Usuario actualizado")
    },
  })

  const users = Array.isArray(data) ? data : []
  const total = users.length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Administración de usuarios del sistema
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Confirmado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : users.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay usuarios
                    </TableCell>
                  </TableRow>
                )
                : users.map((u: Record<string, unknown>) => (
                    <TableRow key={u.id as number}>
                      <TableCell className="font-medium">{u.username as string}</TableCell>
                      <TableCell>{u.email as string}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {(u.role as Record<string, unknown>)?.name as string || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.confirmed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Ban className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.blocked ? "destructive" : "default"}>
                          {u.blocked ? "Bloqueado" : "Activo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger render={<Button variant="ghost" size="sm">{u.blocked ? "Desbloquear" : "Bloquear"}</Button>} />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {u.blocked ? "¿Desbloquear usuario?" : "¿Bloquear usuario?"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {u.blocked
                                  ? `${u.username as string} podrá acceder al sistema`
                                  : `${u.username as string} no podrá acceder al sistema`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  toggleBlockMutation.mutate({
                                    id: u.id as number,
                                    blocked: !u.blocked,
                                  })
                                }
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
