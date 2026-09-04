"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  ClipboardList,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  FileText,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUiStore } from "@/src/store/ui-store"
import { useAuthStore } from "@/src/store/auth-store"
import { useRouter } from "next/navigation"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Membresías", href: "/memberships", icon: Dumbbell },
  { label: "Pago Membresías", href: "/payments", icon: CreditCard },
  { label: "Gestión Membresías", href: "/client-memberships", icon: ClipboardList },
  { label: "Inventario", href: "/inventory", icon: Package },
  { label: "Punto de Venta", href: "/pos", icon: ShoppingCart },
  { label: "Reportes", href: "/reports", icon: BarChart3 },
  { label: "Usuarios", href: "/users", icon: UserCog },
  { label: "Roles", href: "/roles", icon: Shield },
  { label: "Auditoría", href: "/audit", icon: FileText },
  { label: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebar, toggleSidebar, isMobileMenuOpen, setMobileMenuOpen } = useUiStore()
  const logout = useAuthStore((state) => state.logout)
  const isCollapsed = sidebar === "collapsed"
  const showCompactLayout = isCollapsed && !isMobileMenuOpen

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {isMobileMenuOpen && (
        <button type="button" aria-label="Cerrar menu" className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] md:hidden" onClick={closeMobileMenu} />
      )}
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        "-translate-x-full md:translate-x-0",
        isMobileMenuOpen && "translate-x-0 w-72"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          showCompactLayout ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <span className="text-lg font-bold text-sidebar-foreground">
            GymApp
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
           className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={isMobileMenuOpen ? closeMobileMenu : toggleSidebar}
        >
          <span className="sr-only">{showCompactLayout ? "Expandir menu" : "Contraer menu"}</span>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : showCompactLayout ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  showCompactLayout && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!showCompactLayout && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
             "w-full text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            showCompactLayout ? "justify-center px-2" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!showCompactLayout && <span className="ml-3">Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
    </>
  )
}
