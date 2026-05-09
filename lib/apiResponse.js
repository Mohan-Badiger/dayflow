export function ok(data, message = "Success", status = 200) {
  return Response.json(
    { success: true, data, message },
    { status }
  )
}

export function err(message = "Error", status = 400, details = null) {
  const body = { success: false, error: message }
  if (details) body.details = details
  return Response.json(body, { status })
}

export function unauthorized() {
  return Response.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  )
}

export function notFound(resource = "Resource") {
  return Response.json(
    { success: false, error: `${resource} not found` },
    { status: 404 }
  )
}

export function serverError(error) {
  console.error("Server error:", error)
  return Response.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  )
}
