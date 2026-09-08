"use client"

import { Menu, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUiStore } from "@/src/store/ui-store"
import { useAuthStore } from "@/src/store/auth-store"
import { useRouter } from "next/navigation"
import { getInitials } from "@/src/utils/formatters"

export function Header() {
  const { setMobileMenuOpen } = useUiStore()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Cambiar tema</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full"><Avatar className="h-8 w-8"><AvatarFallback>{user ? getInitials(user.username) : <User className="h-4 w-4" />}</AvatarFallback></Avatar></Button>} />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.username}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}