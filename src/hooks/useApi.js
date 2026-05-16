import { useCallback } from "react"
import { useToast }    from "./useToast"  // existing toast hook

export function useApi() {
  const { add: toast } = useToast()

  const request = useCallback(async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      })
      const data = await res.json()
      if (!data.success) {
        toast(data.error || "Something went wrong", "error")
        
        // If user is unauthorized or their account was deleted, force them to the home page
        if (res.status === 401 || data.error === "Unauthorized" || data.error === "User not found") {
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = "/"
        }
        
        return null
      }
      return data.data
    } catch (err) {
      toast("Network error — please try again", "error")
      return null
    }
  }, [toast])

  const get    = (url)              => request(url)
  const post   = (url, body)        => request(url, { method:"POST",   body: JSON.stringify(body) })
  const patch  = (url, body)        => request(url, { method:"PATCH",  body: JSON.stringify(body) })
  const del    = (url)              => request(url, { method:"DELETE" })

  return { get, post, patch, del }
}
