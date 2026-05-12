"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Sun, Dumbbell, Coffee, Apple, Utensils, Moon, Brain, BedDouble,
  Droplets, ChevronDown, ChevronRight, Flame, Heart, Zap, Leaf,
  Clock, AlertTriangle, CheckCircle2, Sparkles, Target, Shield,
} from "lucide-react";

/* ── colour palette per section ── */
const SECTIONS = [
  {
    id: "morning",
    title: "Morning Routine",
    subtitle: "6:00 – 7:30 AM",
    icon: Sun,
    gradient: "from-amber-500/15 to-orange-500/8",
    accent: "#f59e0b",
    blocks: [
      {
        heading: "6:00 – 6:30 AM  ·  Wake Up",
        icon: Sun,
        items: [
          "Drink 1–2 glasses of water",
          "Go outside for sunlight for 15–20 mins",
          "Avoid phone immediately after waking",
        ],
        optional: ["Warm water + lemon", "5 deep breaths outside"],
      },
      {
        heading: "6:30 – 7:15 AM  ·  Exercise",
        icon: Dumbbell,
        subgroups: [
          {
            label: "Mon / Wed / Fri — Strength",
            items: ["Push‑ups — 3 sets", "Squats — 3 sets", "Lunges — 3 sets", "Plank — 3 rounds", "Pull‑ups if possible"],
          },
          {
            label: "Tue / Thu / Sat — Cardio",
            items: ["Running or brisk walking", "Sprint intervals", "Stretching"],
          },
          { label: "Sunday", items: ["Rest or light walking"] },
        ],
      },
      {
        heading: "7:30 AM  ·  Breakfast",
        icon: Coffee,
        options: [
          { label: "Option 1", items: ["3 eggs", "Banana", "Milk"] },
          { label: "Option 2", items: ["Oats with nuts", "Peanut butter", "Fruit"] },
          { label: "Option 3 (Veg)", items: ["Sprouts", "Paneer", "Dry fruits"] },
        ],
        daily: ["4 soaked almonds", "2 walnuts", "Pumpkin seeds"],
      },
    ],
  },
  {
    id: "midmorning",
    title: "Mid‑Morning",
    subtitle: "10:30 – 11:00 AM",
    icon: Apple,
    gradient: "from-emerald-500/15 to-green-500/8",
    accent: "#10b981",
    blocks: [
      {
        heading: "Fruit Snack",
        icon: Apple,
        items: ["Pomegranate", "Apple", "Watermelon", "Banana"],
        note: "Drink enough water throughout.",
      },
    ],
  },
  {
    id: "afternoon",
    title: "Afternoon",
    subtitle: "1:00 – 2:00 PM",
    icon: Utensils,
    gradient: "from-violet-500/15 to-purple-500/8",
    accent: "#8b5cf6",
    blocks: [
      {
        heading: "Lunch — Balanced Meal",
        icon: Utensils,
        items: ["Rice or roti", "Dal", "Vegetables", "Chicken / fish / paneer", "Curd"],
        bestVeg: ["Spinach", "Broccoli", "Beans", "Carrot"],
        avoid: ["Too much fried food", "Soft drinks", "Heavy sugary desserts daily"],
      },
    ],
  },
  {
    id: "evening",
    title: "Evening",
    subtitle: "4:30 – 6:30 PM",
    icon: Zap,
    gradient: "from-sky-500/15 to-cyan-500/8",
    accent: "#0ea5e9",
    blocks: [
      {
        heading: "4:30 – 5:00 PM  ·  Snack",
        icon: Leaf,
        items: ["Peanuts / chikki", "Fruit", "Green tea or normal tea"],
      },
      {
        heading: "5:30 – 6:30 PM  ·  Activity",
        icon: Dumbbell,
        items: ["Walking", "Sports", "Cycling", "Light gym"],
        note: "Avoid sitting the whole evening.",
      },
    ],
  },
  {
    id: "night",
    title: "Night",
    subtitle: "7:30 – 10:30 PM",
    icon: Moon,
    gradient: "from-indigo-500/15 to-blue-500/8",
    accent: "#6366f1",
    blocks: [
      {
        heading: "7:30 – 8:30 PM  ·  Dinner",
        icon: Utensils,
        items: ["Roti + sabji + paneer/chicken", "Soup + eggs", "Rice + dal + vegetables"],
        avoid: ["Heavy junk food at night", "Too much sugar", "Eating very late"],
      },
      {
        heading: "9:00 PM  ·  Relax",
        icon: Brain,
        items: ["Light stretching", "Read something", "Calm music"],
        avoid: ["Stress", "Doom scrolling", "Excess late‑night gaming"],
      },
      {
        heading: "10:00 – 10:30 PM  ·  Sleep",
        icon: BedDouble,
        items: ["7–9 hours sleep", "Sleep before 11 PM regularly"],
        note: "Your body produces most testosterone during deep sleep.",
      },
    ],
  },
];

const WEEKLY_HABITS = [
  { icon: Dumbbell, text: "3–5 days strength training", color: "#10b981" },
  { icon: Target, text: "Maintain healthy weight — less belly fat helps hormone balance", color: "#6366f1" },
  { icon: Droplets, text: "Stay hydrated — 2.5–3.5 litres water daily", color: "#0ea5e9" },
];

const REDUCE_LIST = [
  "Smoking",
  "Alcohol",
  "Excess porn / masturbation if it affects energy",
  "Too much junk food",
  "Sleeping late daily",
];

const DAILY_FOODS = [
  "Eggs", "Banana", "Milk / curd", "Nuts", "Seeds",
  "Chicken / fish / paneer", "Dal", "Fruits", "Vegetables",
];

const PRIORITY_STACK = [
  { n: 1, text: "Sleep", icon: BedDouble },
  { n: 2, text: "Strength exercise", icon: Dumbbell },
  { n: 3, text: "Healthy body fat", icon: Heart },
  { n: 4, text: "Good nutrition", icon: Leaf },
  { n: 5, text: "Stress reduction", icon: Brain },
];

/* ── helpers ── */
const anim = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ── Expandable Section Card ── */
function SectionCard({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = section.icon;

  return (
    <motion.div {...anim(index * 0.06)} className="card overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group transition-colors hover:bg-surface-3/40"
      >
        <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${section.gradient} flex items-center justify-center shrink-0 ring-1 ring-white/5`}>
          <Icon className="w-6 h-6" style={{ color: section.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text-1">{section.title}</h2>
          <p className="text-xs text-text-3 font-medium mt-0.5">{section.subtitle}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-text-3" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 sm:px-6 space-y-5">
              {section.blocks.map((block, bi) => (
                <BlockCard key={bi} block={block} accent={section.accent} delay={bi * 0.05} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Block Card (inside sections) ── */
function BlockCard({ block, accent, delay }) {
  const BIcon = block.icon;
  return (
    <motion.div {...anim(delay)}
      className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-center gap-2.5">
        <BIcon className="w-4.5 h-4.5 shrink-0" style={{ color: accent }} />
        <h3 className="font-semibold text-text-1 text-sm sm:text-base">{block.heading}</h3>
      </div>

      {/* Simple item list */}
      {block.items && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Optional items */}
      {block.optional && (
        <div className="rounded-lg bg-warning/5 border border-warning/10 p-3">
          <p className="text-xs font-bold text-warning mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Optional
          </p>
          <ul className="space-y-1">
            {block.optional.map((item, i) => (
              <li key={i} className="text-sm text-text-2 flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-warning shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subgroups (exercise schedule) */}
      {block.subgroups && (
        <div className="grid grid-cols-1 gap-3">
          {block.subgroups.map((sg, i) => (
            <div key={i} className="rounded-lg bg-surface-3/50 p-3">
              <p className="text-xs font-bold text-text-1 mb-2">{sg.label}</p>
              <ul className="space-y-1">
                {sg.items.map((item, j) => (
                  <li key={j} className="text-sm text-text-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Options (breakfast) */}
      {block.options && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {block.options.map((opt, i) => (
            <div key={i} className="rounded-lg bg-surface-3/50 p-3">
              <p className="text-xs font-bold mb-2" style={{ color: accent }}>{opt.label}</p>
              <ul className="space-y-1">
                {opt.items.map((item, j) => (
                  <li key={j} className="text-sm text-text-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Daily must‑add */}
      {block.daily && (
        <div className="rounded-lg bg-success/5 border border-success/10 p-3">
          <p className="text-xs font-bold text-success mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Daily Must‑Have
          </p>
          <div className="flex flex-wrap gap-2">
            {block.daily.map((d, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/15">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Best vegetables */}
      {block.bestVeg && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
          <p className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Best Vegetables
          </p>
          <div className="flex flex-wrap gap-2">
            {block.bestVeg.map((v, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Avoid list */}
      {block.avoid && (
        <div className="rounded-lg bg-danger/5 border border-danger/10 p-3">
          <p className="text-xs font-bold text-danger mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Avoid
          </p>
          <ul className="space-y-1">
            {block.avoid.map((a, i) => (
              <li key={i} className="text-sm text-text-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Note */}
      {block.note && (
        <p className="text-xs text-text-3 italic flex items-start gap-1.5 pt-1">
          <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-brand" />
          {block.note}
        </p>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */
export default function DietPage() {
  return (
    <PageWrapper className="space-y-8 pb-10">
      {/* ─── Hero ─── */}
      <motion.div {...anim(0)} className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/8 via-transparent to-emerald-500/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Daily Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-1 mt-2">
            Natural Testosterone Support
          </h1>
          <p className="text-text-3 font-medium mt-1.5 max-w-xl leading-relaxed text-sm sm:text-base">
            A practical daily routine for home and student/work life. Follow consistently for at least 8–12 weeks to see results.
          </p>
        </div>
      </motion.div>

      {/* ─── Timeline Sections ─── */}
      <div className="space-y-4">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>

      {/* ─── Weekly Habits ─── */}
      <motion.div {...anim(0.35)} className="card p-6">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-brand" /> Weekly Habits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WEEKLY_HABITS.map((h, i) => {
            const HIcon = h.icon;
            return (
              <motion.div key={i} {...anim(0.35 + i * 0.06)}
                className="rounded-xl bg-surface-2 border border-border p-4 flex items-start gap-3 hover:border-border-2 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: h.color + "18" }}>
                  <HIcon className="w-4.5 h-4.5" style={{ color: h.color }} />
                </div>
                <p className="text-sm text-text-2 leading-relaxed">{h.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Reduce list */}
        <div className="mt-5 rounded-xl bg-danger/5 border border-danger/10 p-4">
          <p className="text-sm font-bold text-danger flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-4 h-4" /> Reduce These
          </p>
          <div className="flex flex-wrap gap-2">
            {REDUCE_LIST.map((r, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger/8 text-danger/80 border border-danger/10">
                {r}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Daily Foods List ─── */}
      <motion.div {...anim(0.4)} className="card p-6">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-emerald-400" /> Simple Daily Foods
        </h2>
        <p className="text-sm text-text-3 mb-4">Eat these regularly for best results:</p>
        <div className="flex flex-wrap gap-2">
          {DAILY_FOODS.map((f, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-emerald-500/8 text-emerald-400 border border-emerald-500/12 hover:bg-emerald-500/14 transition-colors cursor-default">
              {f}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ─── Priority Stack ─── */}
      <motion.div {...anim(0.45)} className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-transparent" />
        <div className="relative">
          <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-warning" /> What Actually Works
          </h2>
          <p className="text-sm text-text-3 mb-5 max-w-lg">
            No food will suddenly boost testosterone overnight. Consistency matters more than "special boosters." The biggest gains come from:
          </p>
          <div className="space-y-3">
            {PRIORITY_STACK.map((p, i) => {
              const PIcon = p.icon;
              const pct = ((5 - i) / 5) * 100;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-brand/15 flex items-center justify-center text-xs font-black text-brand shrink-0">
                    {p.n}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-text-1 flex items-center gap-1.5">
                        <PIcon className="w-3.5 h-3.5 text-text-3" /> {p.text}
                      </span>
                      <span className="text-[10px] text-text-3 font-mono">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-brand"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
