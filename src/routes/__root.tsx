import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import * as React from "react"
import { Header } from "src/components/header"
import { Toaster } from "src/components/ui/sonner"
import { authQueries } from "src/services/queries"
import css from "~/globals.css?url"
import { AppContextProvider } from "~/state/app-state"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    console.log("beforeLoad called in root route")
    const userSession = await context.queryClient.fetchQuery(authQueries.user())
    console.log("User session fetched in beforeLoad:", userSession?.user.name)

    return { userSession: null as any }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "KanTask!",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: css,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  console.log("RootComponent rendered")
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
      import("@tanstack/react-router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

function RootDocument({ children }: { children: React.ReactNode }) {
  console.log("RootDocument rendered")
  return (
    <AppContextProvider>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <Header />
          <hr />
          {children}
          <Scripts />
          <Toaster />
          <React.Suspense>
            <TanStackRouterDevtools />
          </React.Suspense>
        </body>
      </html>
    </AppContextProvider>
  )
}
