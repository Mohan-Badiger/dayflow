"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Target, Activity, Zap, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="h-screen w-full overflow-hidden bg-[#050505] text-white relative font-sans flex flex-col selection:bg-white/20">

      {/* Premium Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Glassmorphism Navigation */}
      <nav className="relative z-50 w-full flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="DayFlow Logo" width={42} height={42} className="rounded-lg shadow-[0_0_20px_rgba(var(--color-brand-rgb),0.35)]" unoptimized />
          <span className="text-xl font-black tracking-tight text-white">DayFlow</span>
        </div>
        <div>
          {session?.user ? (
            <Link href="/analytics" className="relative group active:scale-95 transition-transform block">
              <img
                src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-white/40 transition-colors shadow-lg"
                referrerPolicy="no-referrer"
              />
            </Link>
          ) : (
            <Link href="/login">
              <button className="text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content - Perfect Fit Split View */}
      <div className="flex-1 relative z-10 flex items-center justify-between max-w-[1400px] w-full mx-auto px-8 lg:px-12 gap-12">

        {/* Left Side: Copywriting */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 mb-8 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
            DayFlow 2.0 is Live
          </div>

          <h1 className="text-[3.5rem] lg:text-[5rem] font-black tracking-tighter leading-[1.05] mb-6 text-transparent bg-clip-text bg-linear-to-br from-white via-white/90 to-white/30 drop-shadow-sm">
            Command <br /> Your Day.
          </h1>

          <p className="text-lg lg:text-xl text-white/50 max-w-[480px] mb-10 font-light leading-relaxed">
            The elite productivity suite for high-achievers. Sync your habits, deep work, and lifestyle in one gorgeous, frictionless workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href={session?.user ? "/today" : "/login"}>
              <button className="group h-14 px-8 rounded-full text-base font-bold bg-white text-black hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center">
                {session?.user ? "Enter Dashboard" : "Start For Free"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-[#050505]" />
                <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-10 h-10 rounded-full border-2 border-[#050505]" />
                <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-[#050505]" />
              </div>
              <div className="text-xs text-white/40 leading-tight font-medium">
                Trusted by 10k+<br />Top Performers
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: 3D UI Mockup */}
        <motion.div
          initial={{ rotateY: -20, rotateX: 10, opacity: 0, x: 50 }}
          animate={{ rotateY: -10, rotateX: 5, opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="hidden lg:flex w-1/2 h-full items-center justify-center relative perspective-[2000px]"
        >
          {/* Mockup Card */}
          <div className="relative w-full max-w-[540px] aspect-4/3 rounded-2xl border border-white/10 bg-[#0a0a0b]/80 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(var(--color-brand-rgb),0.2)] p-6 flex flex-col gap-4 transform-gpu hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">

            {/* Mockup Window Controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Analytics Engine</div>
            </div>

            {/* Mockup Content Widgets */}
            <div className="flex-1 flex gap-4 mt-2">
              {/* Left Column Stats */}
              <div className="w-1/3 flex flex-col gap-4">
                <div className="w-full h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                  <Target className="w-5 h-5 text-brand" />
                  <div>
                    <div className="text-2xl font-black text-white">4h 15m</div>
                    <div className="text-[10px] text-white/40 uppercase font-bold mt-1">Deep Work</div>
                  </div>
                </div>
                <div className="w-full h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-2xl font-black text-white">92%</div>
                    <div className="text-[10px] text-white/40 uppercase font-bold mt-1">Efficiency</div>
                  </div>
                </div>
              </div>

              {/* Right Column Chart */}
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-5 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-center z-10 relative">
                  <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                  <div className="h-4 w-8 bg-brand/20 text-brand text-[9px] flex items-center justify-center font-bold rounded">+12%</div>
                </div>

                {/* Abstract Chart Graphic */}
                <div className="flex-1 w-full bg-linear-to-t from-brand/20 via-brand/5 to-transparent rounded-lg border-b-2 border-brand mt-auto relative z-10 flex items-end justify-between px-4 pb-2">
                  <div className="w-2 h-[30%] bg-white/20 rounded-t-sm" />
                  <div className="w-2 h-[50%] bg-white/20 rounded-t-sm" />
                  <div className="w-2 h-[40%] bg-white/20 rounded-t-sm" />
                  <div className="w-2 h-[70%] bg-white/20 rounded-t-sm" />
                  <div className="w-2 h-[60%] bg-white/20 rounded-t-sm" />
                  <div className="w-2 h-[90%] bg-brand rounded-t-sm shadow-[0_0_10px_var(--color-brand)]" />
                </div>

                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Minimal Footer integrated nicely at bottom */}
      <div className="relative z-10 w-full flex justify-between items-center px-8 py-6 text-white/30 text-[11px] font-medium tracking-wide">
        <div>© 2026 DayFlow Inc.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

    </main>
  );
}
