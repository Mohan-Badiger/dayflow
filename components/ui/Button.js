"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? motion.div : motion.button;
  
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-brand text-white hover:bg-brand-dark shadow-sm border border-brand/20",
    outline: "border border-border bg-transparent hover:bg-surface-3 text-text-1",
    ghost: "hover:bg-surface-3 text-text-2 hover:text-text-1 transition-colors",
    success: "bg-success text-white hover:bg-success-dark shadow-sm",
    danger: "bg-danger text-white hover:bg-danger-dark shadow-sm",
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
    xl: "h-14 rounded-full px-10 text-lg",
    icon: "h-9 w-9",
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileTap={{ scale: 0.98 }}
      {...props}
    />
  );
}
