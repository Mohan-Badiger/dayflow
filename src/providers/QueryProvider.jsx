"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }) {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime:    5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}
