import { createServerFileRoute } from "@tanstack/react-start/server"
import { auth } from "~/lib/auth/auth"

export const ServerRoute = createServerFileRoute().methods({
  GET: ({ request }) => {
    console.log("Auth GET request handler called", request)
    return auth.handler(request)
  },
  POST: ({ request }) => {
    console.log("Auth POST request handler called", request)
    return auth.handler(request)
  },
})
