"use client";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Timeline({ events = [] }) {
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  
  if (events.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="flex flex-col items-center justify-center text-slate-500">
          <div className="w-12 h-12 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <p className="font-medium">No events logged yet</p>
          <p className="text-sm mt-1 mb-4">Start your day by logging a session or habit.</p>
          <button 
            onClick={() => setActiveModal("session")}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            <PlusCircle className="w-4 h-4" /> Add your first entry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
      {events.map((event, index) => (
        <motion.div 
          key={event.id || index}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-[var(--color-primary)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="text-[10px] font-bold">{event.time}</span>
          </div>
          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
            <h4 className="font-bold text-sm">{event.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{event.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Just for icon above
function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
