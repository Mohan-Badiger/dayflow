"use client";
import { SessionProvider } from "next-auth/react";
import AutoLogout from "@/components/auth/AutoLogout";

export function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      <AutoLogout />
      {children}
    </SessionProvider>
  );
}
