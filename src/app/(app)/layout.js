import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { GlobalModals } from "@/components/modals/GlobalModals";
import { outfit } from "@/app/fonts";

export default function AppLayout({ children }) {
  return (
    <div className={`flex min-h-screen bg-surface-2 mbfashion-theme ${outfit.variable}`}>
      <Sidebar />
      <main className="flex-1 w-full relative">
        <MobileHeader />
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
      <MobileNav />
      <GlobalModals />
    </div>
  );
}
