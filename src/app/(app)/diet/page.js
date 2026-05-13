"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Coffee, Apple, Utensils, Moon, Droplets, ChevronDown,
  ChevronRight, Flame, Leaf, AlertTriangle, CheckCircle2,
  Sparkles, Zap, Shield, Cookie,
} from "lucide-react";

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

/* ── Expandable Meal Section ── */
function MealSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = section.icon;
  return (
    <motion.div {...anim(index * 0.05)} className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3.5 p-4 sm:p-5 text-left hover:bg-surface-3/30 transition-colors">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: section.accent + "18" }}>
          <Icon className="w-5 h-5" style={{ color: section.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-text-1">{section.title}</h2>
          <p className="text-[11px] text-text-3 font-medium">{section.time}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="w-4.5 h-4.5 text-text-3" /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-4 pb-5 sm:px-5 space-y-3">
              {/* Options grid */}
              {section.options && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {section.options.map((opt, i) => (
                    <div key={i} className="rounded-lg bg-surface-3/50 p-3">
                      <p className="text-xs font-bold mb-1.5" style={{ color: section.accent }}>{opt.label}</p>
                      <ul className="space-y-1">{opt.items.map((x, j) => (
                        <li key={j} className="text-sm text-text-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: section.accent }} />{x}
                        </li>
                      ))}</ul>
                    </div>
                  ))}
                </div>
              )}
              {/* Simple items */}
              {section.items && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {section.items.map((x, i) => (
                    <li key={i} className="text-sm text-text-2 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: section.accent }} />{x}
                    </li>
                  ))}
                </ul>
              )}
              {/* Daily must-have */}
              {section.daily && (
                <div className="rounded-lg bg-success/5 border border-success/10 p-3">
                  <p className="text-xs font-bold text-success mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" /> Daily Must-Have</p>
                  <div className="flex flex-wrap gap-2">
                    {section.daily.map((d, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/15">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Best vegetables */}
              {section.bestVeg && (
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                  <p className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1"><Leaf className="w-3 h-3" /> Best Vegetables</p>
                  <div className="flex flex-wrap gap-2">
                    {section.bestVeg.map((v, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">{v}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Avoid */}
              {section.avoid && (
                <div className="rounded-lg bg-danger/5 border border-danger/10 p-3">
                  <p className="text-xs font-bold text-danger mb-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Avoid</p>
                  <ul className="space-y-1">{section.avoid.map((a, i) => (
                    <li key={i} className="text-sm text-text-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />{a}
                    </li>
                  ))}</ul>
                </div>
              )}
              {/* Note */}
              {section.note && (
                <p className="text-xs text-text-3 italic flex items-start gap-1.5">
                  <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-brand" />{section.note}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Meal Data ── */
const MEALS = [
  {
    title: "Breakfast", time: "7:30 AM", icon: Coffee, accent: "#f59e0b",
    options: [
      { label: "Option 1", items: ["3 eggs", "Banana", "Milk"] },
      { label: "Option 2", items: ["Oats with nuts", "Peanut butter", "Fruit"] },
      { label: "Option 3 (Veg)", items: ["Sprouts", "Paneer", "Dry fruits"] },
    ],
    daily: ["4 soaked almonds", "2 walnuts", "Pumpkin seeds"],
  },
  {
    title: "Mid‑Morning Snack", time: "10:30 – 11:00 AM", icon: Apple, accent: "#10b981",
    items: ["Pomegranate", "Apple", "Watermelon", "Banana"],
    note: "Drink enough water throughout the day.",
  },
  {
    title: "Lunch", time: "1:00 – 2:00 PM", icon: Utensils, accent: "#8b5cf6",
    items: ["Rice or roti", "Dal", "Vegetables", "Chicken / fish / paneer", "Curd"],
    bestVeg: ["Spinach", "Broccoli", "Beans", "Carrot"],
    avoid: ["Too much fried food", "Soft drinks", "Heavy sugary desserts daily"],
  },
  {
    title: "Evening Snack", time: "4:30 – 5:00 PM", icon: Cookie, accent: "#0ea5e9",
    items: ["Peanuts / chikki", "Fruit", "Green tea or normal tea"],
  },
  {
    title: "Dinner", time: "7:30 – 8:30 PM", icon: Moon, accent: "#6366f1",
    items: ["Roti + sabji + paneer/chicken", "Soup + eggs", "Rice + dal + vegetables"],
    avoid: ["Heavy junk food at night", "Too much sugar", "Eating very late"],
    note: "Keep dinner lighter than lunch.",
  },
];

const DAILY_FOODS = [
  "Eggs", "Banana", "Milk / Curd", "Nuts", "Seeds",
  "Chicken / Fish / Paneer", "Dal", "Fruits", "Vegetables",
];

/* ════════════════ MAIN PAGE ════════════════ */
export default function DietPage() {
  return (
    <PageWrapper className="space-y-6 pb-10">
      {/* ── Hero ── */}
      <motion.div {...anim(0)} className="card p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/8 via-transparent to-emerald-500/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Nutrition Plan</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-1">Diet & Nutrition</h1>
          <p className="text-text-3 font-medium mt-1 text-sm sm:text-base max-w-xl">
            What you eat fuels everything. Follow this daily nutrition plan consistently for best results.
          </p>
        </div>
      </motion.div>

      {/* ── Hydration Banner ── */}
      <motion.div {...anim(0.05)} className="card p-4 flex items-center gap-3 border-sky-500/20">
        <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-sky-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-1">Stay Hydrated</p>
          <p className="text-xs text-text-3">Drink 2.5–3.5 litres of water daily. Keep a bottle visible at all times.</p>
        </div>
        <span className="text-lg font-black text-sky-400 shrink-0">💧</span>
      </motion.div>

      {/* ── Meal Sections ── */}
      <div className="space-y-3">
        {MEALS.map((m, i) => <MealSection key={m.title} section={m} index={i} />)}
      </div>

      {/* ── Daily Foods ── */}
      <motion.div {...anim(0.3)} className="card p-5">
        <h2 className="font-bold text-text-1 flex items-center gap-2 mb-3">
          <Leaf className="w-5 h-5 text-emerald-400" /> Simple Daily Foods
        </h2>
        <p className="text-xs text-text-3 mb-3">Eat these regularly for balanced nutrition:</p>
        <div className="flex flex-wrap gap-2">
          {DAILY_FOODS.map((f, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="text-sm font-medium px-3.5 py-1.5 rounded-xl bg-emerald-500/8 text-emerald-400 border border-emerald-500/12">
              {f}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Avoid Foods ── */}
      <motion.div {...anim(0.35)} className="rounded-xl bg-danger/5 border border-danger/10 p-4">
        <p className="text-sm font-bold text-danger flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" /> Foods to Avoid / Limit
        </p>
        <div className="flex flex-wrap gap-2">
          {["Fried food daily", "Soft drinks", "Excess sugar", "Junk food at night", "Processed snacks"].map((r, i) => (
            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger/8 text-danger/80 border border-danger/10">{r}</span>
          ))}
        </div>
      </motion.div>

      {/* ── Reality Check ── */}
      <motion.div {...anim(0.4)} className="card p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-transparent" />
        <div className="relative">
          <h2 className="font-bold text-text-1 flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-warning" /> The Truth About Diet
          </h2>
          <p className="text-sm text-text-3 mb-4">
            No single food will change everything overnight. What matters is <strong className="text-text-1">consistency</strong> over weeks and months.
          </p>
          <div className="space-y-2.5">
            {[
              { n: 1, t: "Eat whole foods daily", pct: 100 },
              { n: 2, t: "Hit your protein target", pct: 85 },
              { n: 3, t: "Stay hydrated all day", pct: 70 },
              { n: 4, t: "Limit junk & sugar", pct: 55 },
              { n: 5, t: "Eat at consistent times", pct: 40 },
            ].map((p, i) => (
              <motion.div key={i} {...anim(0.45 + i*0.06)} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-brand/15 flex items-center justify-center text-[10px] font-black text-brand shrink-0">{p.n}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-sm font-semibold text-text-1">{p.t}</span>
                    <span className="text-[10px] text-text-3 font-mono">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }} transition={{ duration: 1, delay: 0.5+i*0.1 }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
