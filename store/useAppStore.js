import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  activeDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
  setActiveDate: (date) => {
    set({ activeDate: date });
    get().fetchDayLog(date);
  },
  
  // Quick Log Modals state
  activeModal: null, // "session", "meal", "exercise", "mood", null
  setActiveModal: (modal) => set({ activeModal: modal }),

  // Data State
  dayLog: null,
  isLoadingLog: false,

  fetchDayLog: async (date) => {
    set({ isLoadingLog: true });
    try {
      const res = await fetch(`/api/day/${date}`);
      if (res.ok) {
        const data = await res.json();
        set({ dayLog: data });
      }
    } catch (e) {
      console.error("Failed to fetch day log", e);
    } finally {
      set({ isLoadingLog: false });
    }
  },

  updateDayLog: async (action, payload) => {
    const { activeDate, dayLog } = get();
    
    // Optimistic Update
    let optimisticLog = { ...dayLog };
    if (!optimisticLog.diet) optimisticLog.diet = { waterGlasses: 0, meals: [] };

    if (action === "ADD_SESSION") {
      optimisticLog.workSessions = [...(optimisticLog.workSessions || []), payload];
    } else if (action === "ADD_MEAL") {
      optimisticLog.diet.meals = [...(optimisticLog.diet.meals || []), payload];
    } else if (action === "ADD_EXERCISE") {
      optimisticLog.exercise = payload;
    } else if (action === "UPDATE_WATER") {
      optimisticLog.diet.waterGlasses = payload;
    }

    set({ dayLog: optimisticLog });

    // Background Sync
    try {
      const res = await fetch(`/api/day/${activeDate}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        const data = await res.json();
        set({ dayLog: data }); // Set truth from DB
      }
    } catch (e) {
      console.error("Failed to update day log", e);
    }
  }
}));
