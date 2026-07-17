import { create } from 'zustand';
import { format, subMinutes } from 'date-fns';

export const useAppStore = create((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  activeDate: format(subMinutes(new Date(), 30), "yyyy-MM-dd"), // 12:30 AM boundary
  setActiveDate: (date) => {
    set({ activeDate: date });
    get().fetchDayLog(date);
  },
  
  // Quick Log Modals state
  activeModal: null, // "session", "meal", "mood", null
  setActiveModal: (modal) => set({ activeModal: modal }),

  // Data State
  dayLog: null,
  user: null,
  userSettings: null,
  jobGoal: null,
  isLoadingLog: false,
  isLoadingUser: false,

  fetchUser: async () => {
    set({ isLoadingUser: true });
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          set({ 
            user: data.data,
            userSettings: data.data.settings,
            jobGoal: data.data.jobGoal
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch user", e);
    } finally {
      set({ isLoadingUser: false });
    }
  },

  fetchDayLog: async (date) => {
    set({ isLoadingLog: true });
    try {
      const res = await fetch(`/api/day?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          set({ dayLog: data.data });
        } else if (data._id) {
           // Fallback if the other endpoint was used directly
          set({ dayLog: data });
        }
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
    } else if (action === "UPDATE_WATER") {
      optimisticLog.diet.waterGlasses = payload;
    }

    set({ dayLog: optimisticLog });

    // Background Sync
    try {
      let endpoint = "";
      let method = "POST";
      let bodyData = payload;

      if (action === "ADD_SESSION") {
        endpoint = `/api/day/${activeDate}/sessions`;
        method = "POST";
      } else if (action === "ADD_MEAL") {
        endpoint = `/api/day/${activeDate}/diet/meals`;
        method = "POST";
      } else if (action === "UPDATE_WATER") {
        endpoint = `/api/day/${activeDate}/diet`;
        method = "PATCH";
        bodyData = { waterGlasses: payload };
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });
        if (res.ok) {
          const data = await res.json();
          // We can optionally refetch or update state with data.data
          // Since the API returns { success, data }
          get().fetchDayLog(activeDate);
        }
      }
    } catch (e) {
      console.error("Failed to update day log", e);
    }
  }
}));
