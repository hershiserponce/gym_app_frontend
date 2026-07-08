import { create } from "zustand"

type SidebarState = "expanded" | "collapsed"

type UiState = {
  sidebar: SidebarState
  isMobileMenuOpen: boolean
  toggleSidebar: () => void
  setSidebar: (state: SidebarState) => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  sidebar: "expanded",
  isMobileMenuOpen: false,
  toggleSidebar: () =>
    set((state) => ({
      sidebar: state.sidebar === "expanded" ? "collapsed" : "expanded",
    })),
  setSidebar: (state) => set({ sidebar: state }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}))
