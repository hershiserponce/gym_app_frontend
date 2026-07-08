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
import { Shield } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/src/services/api"

export default function RolesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get("/users-permissions/roles")
      return response.data.roles
    },
  })

  const roles = Array.isArray(data) ? data : []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">
          Administración de roles y permisos
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Usuarios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : roles.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Sin roles
                    </TableCell>
                  </TableRow>
                )
                : roles.map((r: Record<string, unknown>) => (
                    <TableRow key={r.id as number}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {r.name as string}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.type as string}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.description as string || "-"}
                      </TableCell>
                      <TableCell>{r.nbUsers as number || 0}</TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
