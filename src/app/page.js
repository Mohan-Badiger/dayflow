"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Target, Activity, Zap } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-surface-2 selection:bg-brand/30 selection:text-white overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between container-app py-6 md:py-8 px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold tracking-tight text-text-1">DayFlow</span>
        </div>
        <div>
          {session?.user ? (
            <Link href="/analytics" className="relative group active:scale-95 transition-transform block">
              <img 
                src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`} 
                alt="Profile" 
                className="w-9 h-9 rounded-full border border-border group-hover:border-brand/50 transition-colors"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`;
                }}
              />
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full px-5">Login</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 md:pt-24 pb-20 md:pb-32 container-app flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-3 border border-border text-[10px] md:text-xs font-medium text-text-2 mb-6 md:mb-8">
            <Zap className="w-3 h-3 text-brand" />
            <span>The Minimalist Productivity Hub</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-text-1">
            Master your days.<br/>
            <span className="text-brand">Design your life.</span>
          </h1>
          
          <p className="text-base md:text-lg text-text-2 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
            A clean, focused workspace for high-achievers. Track routines, focus sessions, and health with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="rounded-full shadow-xl shadow-brand/10 group px-8">
                Start Your Journey
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 md:py-24 container-app px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <LayoutDashboard className="w-5 h-5 text-brand" />,
              title: "Unified Hub",
              desc: "Everything that matters in one clean, beautiful view."
            },
            {
              icon: <Target className="w-5 h-5 text-purple-400" />,
              title: "Deep Focus",
              desc: "Track flow state and study sessions with zero distraction."
            },
            {
              icon: <Activity className="w-5 h-5 text-emerald-400" />,
              title: "Life Patterns",
              desc: "Intelligent analytics connecting your habits and goals."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 md:p-8 rounded-2xl bg-surface-3 border border-border/50 hover:border-brand/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-1">{feature.title}</h3>
              <p className="text-sm text-text-2 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-10 border-t border-border/30 container-app flex flex-col md:flex-row items-center justify-between text-text-3 text-[12px] gap-6 px-4">
        <p>© 2026 DayFlow. All rights reserved.</p>
        <div className="flex items-center gap-6 font-medium">
          <Link href="#" className="hover:text-brand transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-brand transition-colors">Terms</Link>
          <Link href="#" className="hover:text-brand transition-colors">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
