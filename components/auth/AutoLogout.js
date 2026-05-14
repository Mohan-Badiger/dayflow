"use client";

import { useEffect, useCallback, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds

export default function AutoLogout() {
  const { data: session, status } = useSession();
  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const handleLogout = useCallback(() => {
    if (status === "authenticated") {
      signOut({ callbackUrl: "/" });
    }
  }, [status]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    localStorage.setItem("lastActivity", lastActivityRef.current.toString());
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    if (status !== "authenticated") return;

    // Check if we should have been logged out while the tab was closed
    const storedLastActivity = localStorage.getItem("lastActivity");
    if (storedLastActivity) {
      const lastActivity = parseInt(storedLastActivity, 10);
      const now = Date.now();
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        handleLogout();
        return;
      }
    }

    // Event listeners for activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const throttledResetTimer = () => {
      // Throttle the reset to avoid excessive localStorage writes
      if (Date.now() - lastActivityRef.current > 5000) {
        resetTimer();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, throttledResetTimer);
    });

    // Initial timer start
    resetTimer();

    // Periodic check in case setTimeout is throttled by the browser
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        handleLogout();
      }
    }, CHECK_INTERVAL);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledResetTimer);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, [status, resetTimer, handleLogout]);

  return null;
}
