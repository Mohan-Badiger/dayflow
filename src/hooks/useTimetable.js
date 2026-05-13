"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useDayLog(date) {
  return useQuery({
    queryKey: ["daylog", date],
    queryFn: () => fetch(`/api/day?date=${date}`).then(r => r.json()),
    staleTime: 30_000,
  })
}

export function useInvalidateDayLog() {
  const qc = useQueryClient()
  return (date) => {
    qc.invalidateQueries({ queryKey: ["daylog", date] })
  }
}

export function useTimetable(date) {
  return useQuery({
    queryKey: ["timetable", date],
    queryFn: () => fetch(`/api/day/${date}/timetable`).then(r => r.json()),
    staleTime: 30_000,
  })
}

export function useUpdateBlock(date) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ blockId, data }) =>
      fetch(`/api/day/${date}/timetable/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onMutate: async ({ blockId, data }) => {
      await qc.cancelQueries({ queryKey: ["timetable", date] })
      const prev = qc.getQueryData(["timetable", date])
      qc.setQueryData(["timetable", date], (old) => {
        if (!old || !old.data) return old
        return {
          ...old,
          data: old.data.map(b =>
            b._id === blockId ? { ...b, ...data } : b
          ),
        }
      })
      return { prev }
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(["timetable", date], ctx?.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["timetable", date] })
      qc.invalidateQueries({ queryKey: ["daylog", date] })
    },
  })
}

export function useAddBlock(date) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      fetch(`/api/day/${date}/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["timetable", date] })
      qc.invalidateQueries({ queryKey: ["daylog", date] })
    },
  })
}

export function useDeleteBlock(date) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (blockId) =>
      fetch(`/api/day/${date}/timetable/${blockId}`, {
        method: "DELETE",
      }).then(r => r.json()),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["timetable", date] })
      qc.invalidateQueries({ queryKey: ["daylog", date] })
    },
  })
}
