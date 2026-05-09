"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { useTimetable, useUpdateBlock, useAddBlock, useDeleteBlock } from "@/hooks/useTimetable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28, staggerChildren: 0.06 }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

export default function TimetablePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const { data: timetableData } = useTimetable(dateStr);
  const blocks = timetableData?.data || [];
  const updateBlock = useUpdateBlock(dateStr);
  const addBlock = useAddBlock(dateStr);
  const deleteBlock = useDeleteBlock(dateStr);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "study", startTime: "09:00", endTime: "10:00" });

  const timelineRef = useRef(null);

  const goNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const goPrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const goToday = () => setCurrentDate(new Date());

  const swipeHandlers = {
    drag: "x",
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.1,
    onDragEnd: (_, info) => {
      if (info.offset.x < -80) goNextDay();
      if (info.offset.x > 80) goPrevDay();
    },
  };

  const getCategoryColors = (cat) => {
    const map = {
      study: "bg-indigo-100 border-indigo-300 text-indigo-800",
      exercise: "bg-emerald-100 border-emerald-300 text-emerald-800",
      meal: "bg-amber-100 border-amber-300 text-amber-800",
      routine: "bg-violet-100 border-violet-300 text-violet-800",
      break: "bg-slate-100 border-slate-300 text-slate-700",
      personal: "bg-pink-100 border-pink-300 text-pink-800",
    };
    return map[cat] || map.study;
  };

  const toggleStatus = (block) => {
    const nextStatus = {
      'planned': 'in-progress',
      'in-progress': 'done',
      'done': 'skipped',
      'skipped': 'planned'
    }[block.status] || 'planned';
    updateBlock.mutate({ blockId: block._id, data: { status: nextStatus } });
  };

  const handleAddBlock = () => {
    addBlock.mutate(formData, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" exit="exit" className="container-app py-6 space-y-6">
      
      {/* Date Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={goPrevDay} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-(--color-surface-3) transition-colors"><ChevronLeft size={24} /></button>
          <div className="text-center w-[200px]">
            <h1 className="text-2xl whitespace-nowrap">{format(currentDate, "EEEE, d MMM")}</h1>
          </div>
          <button onClick={goNextDay} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-(--color-surface-3) transition-colors"><ChevronRight size={24} /></button>
          <button onClick={goToday} className="pill bg-(--color-surface-3) hover:bg-(--color-border) cursor-pointer text-(--color-text-2) ml-2">Today</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost">Apply template</button>
          <button className="btn-primary">Plan this day</button>
        </div>
      </div>

      {/* Swipeable Container */}
      <motion.div {...swipeHandlers} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Timeline (Left Desktop / Top Mobile) */}
        <div className="lg:col-span-8 bg-white border border-(--color-border) rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-(--color-border) bg-(--color-surface-2) flex justify-between items-center">
            <h2 className="text-[16px] font-semibold">24-Hour Timeline</h2>
            <div className="text-xs font-medium text-(--color-text-3) flex gap-3">
              <span>{blocks.filter(b=>b.status==='planned').length} planned</span>
              <span>•</span>
              <span className="text-(--color-success)">{blocks.filter(b=>b.status==='done').length} done</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto relative no-scrollbar" ref={timelineRef}>
            {/* Ruler */}
            <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-(--color-border) bg-(--color-surface-2) z-10 flex flex-col">
              {Array.from({length: 25}).map((_, i) => (
                <div key={i} className="h-[48px] flex items-start justify-center text-xs text-(--color-text-3) font-medium pt-1 border-b border-transparent">
                  {i.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {/* Grid lines */}
            <div className="ml-16 relative h-[1200px] w-full">
              {Array.from({length: 25}).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-(--color-border) opacity-50" style={{ top: i * 48 }} />
              ))}
              
              {/* Blocks */}
              {blocks.map(block => {
                const [h, m] = block.startTime.split(':').map(Number);
                const top = (h + m/60) * 48;
                const height = (block.durationMinutes / 60) * 48;
                const colors = getCategoryColors(block.category);
                
                return (
                  <motion.div 
                    layoutId={block._id}
                    whileHover={{ scale: 1.01, zIndex: 20 }}
                    key={block._id}
                    className={`absolute left-2 right-4 rounded-md border p-2 overflow-hidden shadow-sm cursor-pointer select-none transition-opacity ${colors} ${block.status==='skipped' ? 'opacity-40' : 'opacity-100'}`}
                    style={{ top, height }}
                    onClick={() => { /* Edit Modal */ }}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm leading-none">{block.title}</p>
                      {block.status === 'done' && <CheckCircle2 size={16} />}
                    </div>
                    {height > 30 && <p className="text-xs opacity-80 mt-1">{block.startTime} - {block.endTime}</p>}
                    {block.status === 'skipped' && <div className="absolute inset-0 bg-black/5" style={{ backgroundImage: "linear-gradient(45deg, transparent 45%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.1) 55%, transparent 55%)", backgroundSize: "10px 10px" }} />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block List (Right Desktop / Bottom Mobile) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-[16px] font-semibold text-(--color-text-1) px-1">Schedule</h2>
          
          <div className="space-y-3">
            {blocks.map(block => (
              <motion.div layoutId={`${block._id}-list`} key={block._id} className="card p-3 flex gap-4 items-center group">
                <div className="flex flex-col items-center justify-center text-(--color-text-3) text-xs font-mono font-medium">
                  <span>{block.startTime}</span>
                  <div className="w-px h-4 bg-(--color-border-2) my-1" />
                  <span>{block.endTime}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColors(block.category).split(' ')[0]}`} />
                    <p className="font-semibold text-[14px] text-(--color-text-1)">{block.title}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span onClick={() => toggleStatus(block)} className="cursor-pointer text-xs font-medium px-2 py-0.5 rounded-full bg-surface-3 text-text-2 hover:bg-border transition-colors">
                      {block.status}
                    </span>
                    <button onClick={() => deleteBlock.mutate(block._id)} className="text-danger hover:text-danger-bg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <button onClick={() => setIsModalOpen(true)} className="w-full border-2 border-dashed border-border hover:border-brand rounded-xl p-4 flex flex-col items-center justify-center text-text-3 hover:text-brand transition-colors gap-2 cursor-pointer bg-surface">
              <Plus size={24} />
              <span className="font-medium text-sm">Add Block</span>
            </button>
          </div>
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Block">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              type="text" 
              className="w-full p-2 rounded border border-border bg-surface" 
              placeholder="e.g. Deep Work Session" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full p-2 rounded border border-border bg-surface"
            >
              <option value="study">Study</option>
              <option value="exercise">Exercise</option>
              <option value="meal">Meal</option>
              <option value="routine">Routine</option>
              <option value="break">Break</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input 
                type="time" 
                value={formData.startTime} 
                onChange={e => setFormData({...formData, startTime: e.target.value})} 
                className="w-full p-2 rounded border border-border bg-surface" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input 
                type="time" 
                value={formData.endTime} 
                onChange={e => setFormData({...formData, endTime: e.target.value})} 
                className="w-full p-2 rounded border border-border bg-surface" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBlock} disabled={!formData.title}>Save Block</Button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
}
