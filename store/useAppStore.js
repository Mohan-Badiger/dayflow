import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
  setActiveDate: (date) => set({ activeDate: date }),
  // Quick Log Modals state
  activeModal: null, // "session", "meal", "exercise", "mood", null
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
