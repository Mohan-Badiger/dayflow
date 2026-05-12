"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Target, Download, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { userSettings, jobGoal: storeJobGoal, fetchUser } = useAppStore();
  const { patch, get } = useApi();
  const { add: toast } = useToast();

  const [settings, setSettings] = useState({
    theme: "system",
    wakeTarget: "06:30",
    sleepTarget: "23:00",
    studyGoalHours: 4,
    waterGoal: 8,
  });

  const [jobGoal, setJobGoal] = useState({
    role: "React / Next.js Developer",
    targetDate: "",
    weeklyHours: 28,
  });

  useEffect(() => {
    if (userSettings) setSettings(prev => ({ ...prev, ...userSettings }));
    if (storeJobGoal) setJobGoal(prev => ({ ...prev, ...storeJobGoal }));
  }, [userSettings, storeJobGoal]);

  const handleSaveSettings = async () => {
    await patch("/api/user/settings", { settings });
    fetchUser(); // Refresh global store
    toast("Settings saved!", "success");
  };

  const handleSaveJobGoal = async () => {
    await patch("/api/user/settings", { jobGoal });
    fetchUser(); // Refresh global store
    toast("Career goal saved!", "success");
  };

  const handleExportData = () => {
    window.open("/api/export", "_blank");
  };

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <PageWrapper className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">Manage your DayFlow experience.</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-400" /> Profile
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center font-bold text-xl text-brand">
                {session?.user?.name?.[0] || "U"}
              </div>
              <div>
                <p className="font-bold text-lg">{session?.user?.name || "User"}</p>
                <p className="text-slate-500">{session?.user?.email || "No email"}</p>
              </div>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" /> Daily Targets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wake Target</label>
              <input type="time" value={settings.wakeTarget} onChange={e => setSettings({...settings, wakeTarget: e.target.value})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sleep Target</label>
              <input type="time" value={settings.sleepTarget} onChange={e => setSettings({...settings, sleepTarget: e.target.value})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Study Goal (hrs)</label>
              <input type="number" value={settings.studyGoalHours} onChange={e => setSettings({...settings, studyGoalHours: Number(e.target.value)})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Water Goal (glasses)</label>
              <input type="number" value={settings.waterGoal} onChange={e => setSettings({...settings, waterGoal: Number(e.target.value)})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
          </div>
          <Button className="mt-4" onClick={handleSaveSettings}>Save Targets</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Career / Long-term Goal
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Role</label>
              <input type="text" value={jobGoal.role} onChange={e => setJobGoal({...jobGoal, role: e.target.value})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <input type="date" value={jobGoal.targetDate} onChange={e => setJobGoal({...jobGoal, targetDate: e.target.value})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekly Study Target (hrs)</label>
                <input type="number" value={jobGoal.weeklyHours} onChange={e => setJobGoal({...jobGoal, weeklyHours: Number(e.target.value)})} className="w-full p-2 border border-(--border) bg-(--background) rounded-md" />
              </div>
            </div>
          </div>
          <Button className="mt-4" onClick={handleSaveJobGoal}>Save Career Goal</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Morning Reminder</p>
                <p className="text-sm text-slate-500">Get notified to start your day</p>
              </div>
              <input type="time" defaultValue="07:00" className="p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Evening Review</p>
                <p className="text-sm text-slate-500">Get notified to log your day</p>
              </div>
              <input type="time" defaultValue="20:00" className="p-2 border border-(--border) bg-(--background) rounded-md" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="gap-2 h-12" onClick={handleExportData}>
            <Download className="w-4 h-4" /> Export Data (JSON)
          </Button>
          <Button variant="danger" className="gap-2 h-12" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
