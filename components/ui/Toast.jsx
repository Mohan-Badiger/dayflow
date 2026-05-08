"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/useToast"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-6 md:right-6 md:left-auto md:translate-x-0 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-[360px] px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              pointerEvents: "auto",
            }}
          >
            {toast.type === "success" && <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />}
            {toast.type === "error" && <AlertCircle size={18} style={{ color: "var(--color-danger)" }} />}
            {toast.type === "info" && <Info size={18} style={{ color: "var(--color-brand)" }} />}
            <span style={{ color: "var(--color-text-1)", fontWeight: 500 }}>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
