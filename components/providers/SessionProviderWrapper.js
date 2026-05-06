"use client";
import { SessionProvider } from "next-auth/react";

export function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
