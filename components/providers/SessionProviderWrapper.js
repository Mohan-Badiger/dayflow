"use client";
import { SessionProvider } from "next-auth/react";
import AutoLogout from "@/components/auth/AutoLogout";
import { useEffect } from "react";

export function SessionProviderWrapper({ children }) {
  useEffect(() => {
    // Fix back-button cache issues (bfcache rendering blank pages on back navigation)
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <SessionProvider>
      <AutoLogout />
      {children}
    </SessionProvider>
  );
}
