"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, CheckSquare, Clock, Apple, Dumbbell, BarChart2, Settings, Flame, Target } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

const navItems = [
  { name: "Today", href: "/today", icon: LayoutDashboard },
  { name: "Timetable", href: "/timetable", icon: CalendarDays },
  { name: "Routine", href: "/routine", icon: CheckSquare },
  { name: "Study", href: "/sessions", icon: Clock },
  { name: "Diet", href: "/diet", icon: Apple },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);

  const { get } = useApi();

  useEffect(() => {
    let mounted = true;
    if (session?.user?.id) {
      get("/api/user/streak").then(data => {
        if (mounted && data?.streak !== undefined) {
          setStreak(data.streak);
        }
      });
    }
    return () => { mounted = false; };
  }, [session]);

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-60 border-r border-border bg-surface h-screen sticky top-0 transition-all">
      <div className="p-6 flex flex-col items-center lg:items-start">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="DayFlow Logo" width={28} height={28} className="rounded-md shadow-sm" unoptimized />
          <h1 className="text-xl font-extrabold tracking-tight text-text-1 lg:block hidden">DayFlow</h1>
        </div>
        <p className="text-[10px] text-text-3 font-semibold uppercase tracking-wider mt-1.5 hidden lg:block">Master your routine</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition-fast relative group",
                isActive
                  ? "bg-brand-light text-brand"
                  : "text-text-2 hover:bg-surface-3 hover:text-text-1"
              )}
            >
              {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.75 bg-brand rounded-r-md hidden lg:block" />}
              <Icon className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium text-text-2 hover:bg-surface-3 hover:text-text-1 transition-(--transition-fast)"
        >
          <Settings className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
          <span className="hidden lg:block">Settings</span>
        </Link>

        <LogoutButton
          className="flex w-full items-center gap-3 px-3 h-10 rounded-md text-sm font-medium text-danger hover:bg-danger-bg hover:text-danger transition-fast"
          text={<span className="hidden lg:block">Sign Out</span>}
        />

        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2 mt-4">
            <img
              src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-border mx-auto lg:mx-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`;
              }}
            />
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-1 truncate">{session.user.name}</p>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-warning mt-0.5">
                  <Flame size={12} fill="currentColor" />
                  {streak} Day Streak
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
