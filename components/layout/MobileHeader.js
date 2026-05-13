"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function MobileHeader() {
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/streak")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.streak !== undefined) {
            setStreak(data.data.streak);
          }
        })
        .catch(err => console.error("Failed to fetch streak:", err));
    }
  }, [session]);

  if (!session?.user) return null;

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="relative group active:scale-95 transition-transform">
          <img 
            src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border border-border shadow-sm group-hover:border-brand/50 transition-colors"
          />
          <div className="absolute inset-0 rounded-full bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <div className="min-w-0">
          <p className="text-[13px] font-black text-text-1 truncate leading-tight tracking-tight uppercase">{session.user.name}</p>
          <p className="text-[10px] text-brand font-bold uppercase tracking-[0.2em] mt-0.5">DayFlow</p>
        </div>
      </div>

      {streak > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-warning"
        >
          <Flame size={14} fill="currentColor" className="animate-pulse" />
          <span className="text-sm font-black tabular-nums">{streak}</span>
        </motion.div>
      )}
    </header>
  );
}
