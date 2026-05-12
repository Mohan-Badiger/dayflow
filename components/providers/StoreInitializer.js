"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useSession } from "next-auth/react";

export function StoreInitializer() {
  const { status } = useSession();
  const fetchUser = useAppStore((state) => state.fetchUser);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status, fetchUser]);

  return null;
}
