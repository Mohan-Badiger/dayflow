"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Card({ className, ...props }) {
  return (
    <motion.div
      className={cn("rounded-xl border border-border bg-surface text-text-1 shadow-sm p-4", className)}
      whileHover={{ scale: 1.01 }}
      {...props}
    />
  );
}
