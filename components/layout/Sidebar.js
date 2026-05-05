"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Clock, Apple, Dumbbell, SmilePlus, Target, BarChart2, Settings, ListTodo } from "lucide-react";

const navItems = [
  { name: "Today", href: "/today", icon: LayoutDashboard },
  { name: "Routine", href: "/routine", icon: CheckSquare },
  { name: "Sessions", href: "/sessions", icon: Clock },
  { name: "Diet", href: "/diet", icon: Apple },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Mood", href: "/mood", icon: SmilePlus },
  { name: "Habits", href: "/habits", icon: ListTodo },
  { name: "Review", href: "/review", icon: CheckSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Weekly", href: "/weekly", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--card)] h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">DayFlow</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border)]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
