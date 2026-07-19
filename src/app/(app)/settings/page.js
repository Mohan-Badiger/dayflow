"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import {
  User, Bell, Download, LogOut, Edit2, Check,
  X, Shield, Moon, Sun, Settings as SettingsIcon, AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { fetchUser } = useAppStore();
  const { patch, del } = useApi();
  const { add: toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await patch("/api/user", { name: name.trim() });
    if (res) {
      await update({ name: name.trim() });
      fetchUser();
      toast("Profile updated successfully", "success");
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleExportData = () => {
    window.open("/api/export", "_blank");
  };

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await signOut({ callbackUrl: "/login" });
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "delete my account") return;
    setLoading(true);
    const res = await del("/api/user");
    if (res) {
      toast("Account deleted successfully.", "success");
      await handleLogout();
    } else {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-brand/5" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand/15 flex items-center justify-center shrink-0">
            <SettingsIcon className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-1">Settings</h1>
            <p className="text-sm text-text-3 mt-0.5">Manage your profile and preferences.</p>
          </div>
        </div>
      </motion.div>

      {/* ── Profile ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-brand" /> Profile details
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-brand/20 border-4 border-surface overflow-hidden bg-surface-2">
            <img
              src={session?.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name || "U"}`}
              alt="Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name || "U"}`;
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 w-full">
                <p className="text-xs font-bold text-text-3 uppercase tracking-wider">Display Name</p>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field py-1.5 px-3 max-w-200px"
                      placeholder="Your name"
                      autoFocus
                    />
                    <button onClick={handleSaveProfile} disabled={loading || !name.trim()}
                      className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center hover:bg-success/25 transition-colors disabled:opacity-50">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setIsEditing(false); setName(session?.user?.name || ""); }} disabled={loading}
                      className="w-8 h-8 rounded-lg bg-surface-3 text-text-3 flex items-center justify-center hover:text-text-1 transition-colors disabled:opacity-50">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg text-text-1">{session?.user?.name || "User"}</p>
                    <button onClick={() => { setName(session?.user?.name || ""); setIsEditing(true); }}
                      className="text-text-3 hover:text-brand transition-colors p-1">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-text-3 uppercase tracking-wider">Email Address</p>
              <p className="font-medium text-text-2">{session?.user?.email || "No email provided"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Notifications ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card p-6">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-warning" /> Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-2 hover:border-border-2 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center">
                <Sun className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-bold text-sm text-text-1">Morning Reminder</p>
                <p className="text-xs text-text-3 mt-0.5">Kickstart your day</p>
              </div>
            </div>
            <input type="time" defaultValue="07:00" className="input-field py-1.5 px-3 w-28 text-center" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-2 hover:border-border-2 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
                <Moon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="font-bold text-sm text-text-1">Evening Review</p>
                <p className="text-xs text-text-3 mt-0.5">Log your daily progress</p>
              </div>
            </div>
            <input type="time" defaultValue="20:00" className="input-field py-1.5 px-3 w-28 text-center" />
          </div>
        </div>
      </motion.div>

      {/* ── Account Actions ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-success" /> Account Settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all bg-surface-3 text-text-1 hover:bg-surface-3/70 border border-border">
            <Download className="w-4 h-4" /> Export Data (JSON)
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* ── Critical Account Actions ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="card p-6 border-danger/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-danger/5" />
        <div className="relative">
          <h2 className="text-lg font-bold text-danger flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Critical Account Actions
          </h2>
          <p className="text-sm text-text-3 mb-5">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-xl font-bold text-sm transition-all bg-danger text-white hover:bg-danger/90 border border-danger/20">
              Delete Account
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-danger/30 bg-surface">
              <p className="text-sm font-bold text-text-1 mb-2">Are you absolutely sure?</p>
              <p className="text-xs text-text-3 mb-4">
                Please type <span className="font-mono font-bold text-danger">delete my account</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="delete my account"
                className="input-field mb-3 w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="flex-1 py-2 rounded-xl font-bold text-sm bg-surface-3 text-text-1 hover:bg-surface-3/70 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteInput !== "delete my account"}
                  className="flex-1 py-2 rounded-xl font-bold text-sm bg-danger text-white hover:bg-danger/90 transition-colors disabled:opacity-50">
                  {loading ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

    </PageWrapper>
  );
}
