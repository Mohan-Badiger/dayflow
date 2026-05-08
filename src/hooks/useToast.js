import { create } from 'zustand'

export const useToast = create((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = crypto.randomUUID()
    set(s => ({ toasts: [...s.toasts.slice(-2), { id, message, type }] }))
    setTimeout(() => set(s => ({
      toasts: s.toasts.filter(t => t.id !== id)
    })), 3500)
  },
  remove: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
