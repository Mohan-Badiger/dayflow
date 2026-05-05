"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Target, Download, LogOut } from "lucide-react";

export default function SettingsPage() {
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
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xl text-slate-500">
                U
              </div>
              <div>
                <p className="font-bold text-lg">User Name</p>
                <p className="text-slate-500">user@example.com</p>
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
              <input type="time" defaultValue="06:30" className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sleep Target</label>
              <input type="time" defaultValue="23:00" className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Study Goal (hrs)</label>
              <input type="number" defaultValue={4} className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Water Goal (glasses)</label>
              <input type="number" defaultValue={8} className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
          </div>
          <Button className="mt-4">Save Targets</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Career / Long-term Goal
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Role</label>
              <input type="text" defaultValue="React / Next.js Developer" className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <input type="date" className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekly Study Target (hrs)</label>
                <input type="number" defaultValue={28} className="w-full p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
              </div>
            </div>
          </div>
          <Button className="mt-4">Save Career Goal</Button>
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
              <input type="time" defaultValue="07:00" className="p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Evening Review</p>
                <p className="text-sm text-slate-500">Get notified to log your day</p>
              </div>
              <input type="time" defaultValue="20:00" className="p-2 border border-[var(--border)] bg-[var(--background)] rounded-md" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="gap-2 h-12">
            <Download className="w-4 h-4" /> Export Data (JSON)
          </Button>
          <Button variant="danger" className="gap-2 h-12">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
