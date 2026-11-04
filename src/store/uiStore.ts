import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationCount: number;
  setSidebarOpen: (val: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (val: boolean) => void;
  toggleCommandPalette: () => void;
  setNotificationCount: (count: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  notificationCount: 3,

  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandPaletteOpen: (val) => set({ commandPaletteOpen: val }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setNotificationCount: (count) => set({ notificationCount: count }),
}));
