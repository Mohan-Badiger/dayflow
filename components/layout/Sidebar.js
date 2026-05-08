"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, CheckSquare, Clock, Apple, Dumbbell, ListTodo, BarChart2, Target, Settings, Flame } from "lucide-react";
import { useSession } from "next-auth/react";

const navItems = [
  { name: "Today", href: "/today", icon: LayoutDashboard },
  { name: "Timetable", href: "/timetable", icon: CalendarDays },
  { name: "Routine", href: "/routine", icon: CheckSquare },
  { name: "Study", href: "/sessions", icon: Clock },
  { name: "Diet", href: "/diet", icon: Apple },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Habits", href: "/habits", icon: ListTodo },
  { name: "Review", href: "/review", icon: CheckSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Weekly", href: "/weekly", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden md:flex flex-col w-[80px] lg:w-[240px] border-r border-(--color-border) bg-(--color-surface) h-screen sticky top-0 transition-all">
      <div className="p-6 flex flex-col items-center lg:items-start">
        <h1 className="text-2xl font-bold text-(--color-brand) lg:block hidden">DayFlow</h1>
        <h1 className="text-2xl font-bold text-(--color-brand) block lg:hidden">DF</h1>
        <p className="text-xs text-(--color-text-3) mt-1 hidden lg:block">Master your routine</p>
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
                "flex items-center gap-3 px-3 h-[40px] rounded-md text-sm font-medium transition-(--transition-fast) relative group",
                isActive
                  ? "bg-(--color-brand-light) text-(--color-brand)"
                  : "text-(--color-text-2) hover:bg-(--color-surface-3) hover:text-(--color-text-1)"
              )}
            >
              {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-(--color-brand) rounded-r-md hidden lg:block" />}
              <Icon className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-(--color-border) space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 h-[40px] rounded-md text-sm font-medium text-(--color-text-2) hover:bg-(--color-surface-3) hover:text-(--color-text-1) transition-(--transition-fast)"
        >
          <Settings className="w-5 h-5 shrink-0 mx-auto lg:mx-0" />
          <span className="hidden lg:block">Settings</span>
        </Link>
        
        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2 mt-4">
            <img src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} alt="Avatar" className="w-8 h-8 rounded-full border border-(--color-border) mx-auto lg:mx-0" />
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-sm font-semibold text-(--color-text-1) truncate">{session.user.name}</p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-(--color-warning) mt-0.5">
                <Flame size={12} fill="currentColor" />
                14 Day Streak
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
