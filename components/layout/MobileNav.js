"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CalendarDays, BarChart2, MoreHorizontal,
  CheckSquare, Clock, Apple, Dumbbell, Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { LogoutButton } from "@/components/auth/LogoutButton";

const tabs = [
  { name: "Today", href: "/today", icon: LayoutDashboard },
  { name: "Timetable", href: "/timetable", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "More", action: "more", icon: MoreHorizontal },
];

const moreMenuLinks = [
  { name: "Routine", href: "/routine", icon: CheckSquare },
  { name: "Study", href: "/sessions", icon: Clock },
  { name: "Diet", href: "/diet", icon: Apple },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-surface border-t border-border pb-[env(safe-area-inset-bottom)] z-50 flex justify-around items-center px-2">
        {tabs.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.action === "more") {
            return (
              <button
                key="more"
                onClick={() => setIsMoreOpen(true)}
                className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-text-3 hover:text-text-2"
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-brand" : "text-text-3 hover:text-text-2"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <Modal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="More">
        <div className="flex flex-col space-y-2 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {moreMenuLinks.map((link) => {
              const LinkIcon = link.icon;
              const isLinkActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border bg-surface transition-all active:scale-95",
                    isLinkActive ? "border-brand/40 bg-brand/10 text-brand" : "text-text-2 hover:bg-surface-3 hover:text-text-1"
                  )}
                >
                  <LinkIcon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{link.name}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="pt-6 mt-4 border-t border-border">
            <LogoutButton 
              className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-danger border border-danger/20 bg-danger/10 active:scale-95 transition-all"
              text="Sign Out"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}