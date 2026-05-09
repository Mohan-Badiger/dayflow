"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? motion.div : motion.button;
  
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-brand text-white hover:bg-[#6c65bd] shadow-sm",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    success: "bg-success text-white hover:bg-[#18805e] shadow-sm",
    danger: "bg-warning text-white hover:bg-[#b04a28] shadow-sm",
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
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
