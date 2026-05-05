"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Clock, PlusCircle, CheckSquare, ListTodo } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const mobileItems = [
  { name: "Today", href: "/today", icon: LayoutDashboard },
  { name: "Routine", href: "/routine", icon: CheckSquare },
  { name: "Add", href: "#", icon: PlusCircle, isAction: true },
  { name: "Sessions", href: "/sessions", icon: Clock },
  { name: "Habits", href: "/habits", icon: ListTodo },
];

export function MobileNav() {
  const pathname = usePathname();
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-(--card) border-t border-(--border) flex items-center justify-around z-50 px-2 pb-safe">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key="add-action"
              onClick={() => setActiveModal("session")} // Default to session for now
              className="flex flex-col items-center justify-center w-12 h-12 -mt-6 rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-12 gap-1 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-slate-400 hover:text-slate-900"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
