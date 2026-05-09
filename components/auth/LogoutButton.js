"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton({ className, variant = "default", showIcon = true, text = "Sign Out" }) {
  const handleLogout = async () => {
    // Clear local cache if necessary
    localStorage.clear();
    sessionStorage.clear();
    
    // Call next-auth signOut and redirect to login
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button 
      onClick={handleLogout}
      className={className || "flex items-center gap-2 text-sm font-medium text-danger hover:text-danger-bg transition-colors"}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      <span>{text}</span>
    </button>
  );
}
