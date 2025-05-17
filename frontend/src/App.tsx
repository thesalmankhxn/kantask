import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import "./App.css";
import { routeTree } from "./routeTree.gen";

// Set up a Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  // defaultPendingComponent: DefaultPendingComponent,
  scrollRestoration: true,
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
