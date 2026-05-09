"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, subDays, isToday } from "date-fns";
import {
  ChevronLeft, ChevronRight, Plus, CheckCircle2, Trash2,
  Clock, CalendarDays, Zap, BookOpen, Dumbbell, Coffee,
  User, Pause, Sparkles, GripVertical
} from "lucide-react";
import { useTimetable, useUpdateBlock, useAddBlock, useDeleteBlock } from "@/hooks/useTimetable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";

const CAT_CONFIG = {
  study:    { color: "#6366f1", bg: "#6366f120", icon: BookOpen,  label: "Study" },
  exercise: { color: "#10b981", bg: "#10b98120", icon: Dumbbell,  label: "Exercise" },
  meal:     { color: "#f59e0b", bg: "#f59e0b20", icon: Coffee,    label: "Meal" },
  routine:  { color: "#8b5cf6", bg: "#8b5cf620", icon: Clock,     label: "Routine" },
  break:    { color: "#94a3b8", bg: "#94a3b820", icon: Pause,     label: "Break" },
  personal: { color: "#ec4899", bg: "#ec489920", icon: User,      label: "Personal" },
};

const STATUS_STYLES = {
  planned:       { bg: "bg-surface-3", text: "text-text-2", label: "Planned" },
  "in-progress": { bg: "bg-warning/20", text: "text-warning", label: "In Progress" },
  done:          { bg: "bg-success/20", text: "text-success", label: "Done" },
  skipped:       { bg: "bg-danger/20", text: "text-danger", label: "Skipped" },
};

function ScoreRing({ value, max, size = 64 }) {
  const pct = max > 0 ? value / max : 0;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 0.8 ? "var(--color-success)" : pct >= 0.5 ? "var(--color-warning)" : "var(--color-text-3)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-text-1">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const { data: timetableData, isLoading } = useTimetable(dateStr);
  const blocks = timetableData?.data || [];
  const updateBlock = useUpdateBlock(dateStr);
  const addBlock = useAddBlock(dateStr);
  const deleteBlock = useDeleteBlock(dateStr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "study", startTime: "09:00", endTime: "10:00" });
  const timelineRef = useRef(null);

  const goNext = () => setCurrentDate(p => addDays(p, 1));
  const goPrev = () => setCurrentDate(p => subDays(p, 1));
  const goToday = () => setCurrentDate(new Date());

  // Auto-scroll to current hour on load
  useEffect(() => {
    if (timelineRef.current && isToday(currentDate)) {
      const hour = new Date().getHours();
      timelineRef.current.scrollTop = Math.max(0, hour * 60 - 120);
    }
  }, [currentDate, blocks.length]);

  const toggleStatus = (block) => {
    const next = { planned: "in-progress", "in-progress": "done", done: "skipped", skipped: "planned" }[block.status] || "planned";
    updateBlock.mutate({ blockId: block._id, data: { status: next } });
  };

  const handleAdd = () => {
    if (!formData.title) return;
    addBlock.mutate(formData, { onSuccess: () => { setIsModalOpen(false); setFormData({ title: "", category: "study", startTime: "09:00", endTime: "10:00" }); } });
  };

  // Stats
  const doneCount = blocks.filter(b => b.status === "done").length;
  const totalMin = blocks.reduce((s, b) => s + (b.durationMinutes || 0), 0);
  const catStats = blocks.reduce((a, b) => { a[b.category] = (a[b.category] || 0) + 1; return a; }, {});

  // Current time marker
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <PageWrapper className="space-y-5 pb-8">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={goPrev} className="w-10 h-10 rounded-xl bg-surface border border-border hover:bg-surface-3 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-text-2" />
          </button>
          <div className="text-center min-w-[180px]">
            <h1 className="text-xl font-bold text-text-1">{format(currentDate, "EEEE")}</h1>
            <p className="text-sm text-text-3 font-medium">{format(currentDate, "d MMMM yyyy")}</p>
          </div>
          <button onClick={goNext} className="w-10 h-10 rounded-xl bg-surface border border-border hover:bg-surface-3 flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5 text-text-2" />
          </button>
          {!isToday(currentDate) && (
            <button onClick={goToday} className="pill bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20 transition-colors cursor-pointer">Today</button>
          )}
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-10">
          <Plus className="w-4 h-4" /> Add Block
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3 flex items-center gap-3">
          <ScoreRing value={doneCount} max={blocks.length} />
          <div><p className="text-xs text-text-3">Completion</p><p className="font-bold text-text-1">{doneCount}/{blocks.length}</p></div>
        </div>
        <div className="card p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center"><Clock className="w-5 h-5 text-brand" /></div>
          <div><p className="text-xs text-text-3">Total Time</p><p className="font-bold text-text-1">{Math.floor(totalMin/60)}h {totalMin%60}m</p></div>
        </div>
        <div className="card p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><Zap className="w-5 h-5 text-success" /></div>
          <div><p className="text-xs text-text-3">Blocks</p><p className="font-bold text-text-1">{blocks.length} planned</p></div>
        </div>
        <div className="card p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-warning" /></div>
          <div><p className="text-xs text-text-3">Categories</p><p className="font-bold text-text-1">{Object.keys(catStats).length} active</p></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-8 card overflow-hidden flex flex-col" style={{ height: "calc(100vh - 320px)", minHeight: 500 }}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-text-1">Timeline</h2>
            <div className="flex gap-3 text-xs font-medium text-text-3">
              <span>{blocks.filter(b => b.status === "planned").length} planned</span>
              <span className="text-success">{doneCount} done</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto relative" ref={timelineRef}>
            {/* Hour markers */}
            <div className="absolute left-0 top-0 bottom-0 w-14 border-r border-border bg-surface-2 z-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-[60px] flex items-start justify-center text-[10px] text-text-3 font-mono font-medium pt-1">
                  {String(i).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="ml-14 relative" style={{ height: 24 * 60 }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-border/40" style={{ top: i * 60 }} />
              ))}

              {/* Now line */}
              {isToday(currentDate) && (
                <div className="absolute left-0 right-0 z-20 flex items-center" style={{ top: nowMinutes }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-danger -ml-1" />
                  <div className="flex-1 h-px bg-danger" />
                </div>
              )}

              {/* Blocks */}
              {blocks.map(block => {
                const [h, m] = (block.startTime || "0:0").split(":").map(Number);
                const top = h * 60 + m;
                const height = Math.max(block.durationMinutes || 30, 24);
                const cat = CAT_CONFIG[block.category] || CAT_CONFIG.study;
                const isDone = block.status === "done";
                const isSkipped = block.status === "skipped";

                return (
                  <motion.div
                    key={block._id}
                    layoutId={block._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isSkipped ? 0.4 : 1, scale: 1 }}
                    className="absolute left-1 right-3 rounded-xl p-2.5 cursor-pointer border overflow-hidden group"
                    style={{ top, height: Math.max(height, 28), backgroundColor: cat.bg, borderColor: cat.color + "40" }}
                    onClick={() => toggleStatus(block)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className={`font-bold text-xs leading-tight truncate ${isDone ? "line-through opacity-60" : ""}`} style={{ color: cat.color }}>{block.title}</p>
                        {height > 36 && <p className="text-[10px] mt-0.5 font-mono" style={{ color: cat.color + "99" }}>{block.startTime}–{block.endTime}</p>}
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: cat.color }} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="font-bold text-text-1 px-1">Schedule</h2>

          {blocks.length === 0 && !isLoading ? (
            <div className="card p-10 text-center">
              <CalendarDays className="w-10 h-10 text-text-3 mx-auto mb-3 opacity-30" />
              <p className="text-text-3 text-sm">No blocks planned yet.</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-3 gap-2 text-xs">
                <Plus className="w-3 h-3" /> Add First Block
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {blocks.map((block, i) => {
                const cat = CAT_CONFIG[block.category] || CAT_CONFIG.study;
                const CatIcon = cat.icon;
                const st = STATUS_STYLES[block.status] || STATUS_STYLES.planned;
                return (
                  <motion.div key={block._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="card p-3 flex gap-3 items-center group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg }}>
                      <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text-1 truncate">{block.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-text-3">{block.startTime}–{block.endTime}</span>
                        <button onClick={() => toggleStatus(block)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${st.bg} ${st.text} transition-colors`}>
                          {st.label}
                        </button>
                      </div>
                    </div>
                    <button onClick={() => deleteBlock.mutate(block._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-text-3 hover:text-danger rounded-lg hover:bg-danger/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          <button onClick={() => setIsModalOpen(true)}
            className="w-full border-2 border-dashed border-border hover:border-brand rounded-xl p-4 flex items-center justify-center gap-2 text-text-3 hover:text-brand transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /><span className="text-sm font-medium">Add Block</span>
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Block">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-text-2">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="input-field" placeholder="e.g. Deep Work — React Hooks" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-text-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CAT_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={key} onClick={() => setFormData({ ...formData, category: key })}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${formData.category === key ? "border-brand bg-brand/10 text-brand" : "border-border bg-surface text-text-2 hover:border-border-2"}`}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />{cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-text-2">Start</label>
              <input type="time" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="input-field scheme-dark" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-text-2">End</label>
              <input type="time" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="input-field scheme-dark" />
            </div>
          </div>
          <Button className="w-full h-11 text-sm" onClick={handleAdd} disabled={!formData.title}>
            <Plus className="w-4 h-4 mr-2" /> Add to Timeline
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
