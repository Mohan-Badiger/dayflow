"use client";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function StatCard({ title, value, subtitle, icon: Icon, colorClass, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    >
      <Card className="flex items-center p-5 gap-4">
        <div className={`p-3 rounded ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
          {Icon && <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
