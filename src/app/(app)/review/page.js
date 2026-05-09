"use client";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle, Activity, Target } from "lucide-react";

export default function ReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const { patch, get } = useApi();
  const { activeDate, dayLog } = useAppStore();

  const [formData, setFormData] = useState({
    wins: "",
    blockers: "",
    reflection: "",
    gratitude: "",
    tomorrowPriority: ""
  });

  useEffect(() => {
    if (dayLog?.eveningReview) {
      setFormData(prev => ({
        ...prev,
        ...dayLog.eveningReview
      }));
    }
  }, [dayLog]);

  const handleSubmit = async () => {
    const res = await patch(`/api/day/${activeDate}/review`, formData);
    if (res?.dayScore !== undefined) {
      setScore(res.dayScore);
      setBreakdown(dayLog?.scoreBreakdown || {});
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/50"
        >
          <span className="text-5xl font-black">{score}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-2">Good day!</h1>
          <p className="text-xl text-slate-500 max-w-md mx-auto">
            You've completed your evening review. Time to rest and prepare for tomorrow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-sm w-full"
        >
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Routine</p>
            <p className="text-xl font-bold">{breakdown.routineScore || 0}<span className="text-sm font-normal text-slate-400">/25</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Study</p>
            <p className="text-xl font-bold">{breakdown.timetableScore || 0}<span className="text-sm font-normal text-slate-400">/25</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Health</p>
            <p className="text-xl font-bold">{breakdown.healthScore || 0}<span className="text-sm font-normal text-slate-400">/25</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Review</p>
            <p className="text-xl font-bold">25<span className="text-sm font-normal text-slate-400">/25</span></p>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Evening Review</h1>
        <p className="text-slate-500">Reflect on today, prepare for tomorrow.</p>
      </div>

      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Today's Wins
            </label>
            <textarea
              value={formData.wins}
              onChange={e => setFormData({...formData, wins: e.target.value})}
              className="w-full p-4 rounded-xl border border-border bg-background min-h-[100px] resize-y focus:ring-2 focus:ring-primary outline-none transition-shadow"
              placeholder="What went well today? Big or small."
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2">Blockers & Challenges</label>
            <textarea
              value={formData.blockers}
              onChange={e => setFormData({...formData, blockers: e.target.value})}
              className="w-full p-4 rounded-xl border border-border bg-background min-h-[100px] resize-y focus:ring-2 focus:ring-warning outline-none transition-shadow"
              placeholder="What held you back?"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2">Reflection</label>
            <textarea
              value={formData.reflection}
              onChange={e => setFormData({...formData, reflection: e.target.value})}
              className="w-full p-4 rounded-xl border border-border bg-background min-h-[100px] resize-y focus:ring-2 focus:ring-primary outline-none transition-shadow"
              placeholder="What would you do differently?"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2">Gratitude</label>
            <input
              type="text"
              value={formData.gratitude}
              onChange={e => setFormData({...formData, gratitude: e.target.value})}
              className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-success outline-none transition-shadow"
              placeholder="One thing you're grateful for today..."
            />
          </div>

          <div className="pt-4 border-t border-border">
            <label className="flex items-center gap-2 text-lg font-bold mb-2">
              <Target className="w-5 h-5 text-primary" /> Tomorrow's Top Priority
            </label>
            <input
              type="text"
              value={formData.tomorrowPriority}
              onChange={e => setFormData({...formData, tomorrowPriority: e.target.value})}
              className="w-full p-4 rounded-xl border-2 border-primary bg-background focus:ring-4 focus:ring-primary/20 outline-none transition-shadow text-lg font-medium"
              placeholder="The ONE thing you must accomplish tomorrow"
            />
          </div>
        </div>

        <Button size="lg" className="w-full text-lg h-14" onClick={handleSubmit}>
          <CheckCircle className="w-5 h-5 mr-2" /> Complete Review & Calculate Score
        </Button>
      </Card>
    </PageWrapper>
  );
}
