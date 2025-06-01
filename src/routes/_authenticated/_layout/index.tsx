import { ErrorComponent, Outlet, useNavigate } from "@tanstack/react-router";
import React, { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EventCardSkeleton } from "src/components/event/event-card-skeleton";
import { EventsList } from "src/components/event/events-list";
import { EventFiltersBar } from "src/components/filters/event-filters-bar";
import { Layout } from "src/components/layout";
import { EventFilters, EventFiltersSchema } from "src/services/event.schema";
import { tagQueries } from "src/services/queries";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { getSidebarStateFromCookie } from "~/lib/utils";

export const Route = createFileRoute({
  beforeLoad: ({ context }) => {
    context.queryClient.ensureQueryData(tagQueries.list());
  },
  component: Home,
  validateSearch: EventFiltersSchema,
});

const skeletons = Array.from({ length: 2 });

function Home() {
  const filters = Route.useSearch();

  const navigate = useNavigate();
  const setFilters = (newFilters: EventFilters) => {
    navigate({ from: Route.fullPath, search: newFilters });
  };

  const defaultSidebarState = useMemo(() => getSidebarStateFromCookie(), []);

  return (
    <SidebarProvider defaultOpen={defaultSidebarState}>
      <AppSidebar />

      <main className="flex flex-col h-svh flex-1">
        {/* <TopSection /> */}

        <div className="flex-1 min-h-0 h-full">
          <Outlet />
        </div>
      </main>

      {/* <CommandDialog /> */}
    </SidebarProvider>
  );
}
