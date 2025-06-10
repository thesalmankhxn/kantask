import { redirect } from "@tanstack/react-router";
import { ProfileCard } from "src/components/profile-card";
import { Layout } from "~/components/layout";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { WrappedTooltip } from "~/components/ui/tooltip";
import { SettingsSidebar } from "~/features/settings-sidebar";
import { authQueries } from "~/services/queries";

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userSession = await context.user;
    if (!userSession) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <SidebarProvider className="relative">
      <SettingsSidebar />

      <div className="relative w-full">
        <div className="container max-w-2xl p-10 mx-auto">
          <ProfileCard />
        </div>
        <MobileSidebarTrigger />
      </div>
    </SidebarProvider>
  );
}

function MobileSidebarTrigger() {
  const { isMobile } = useSidebar();

  if (!isMobile) return null;
  return (
    <WrappedTooltip>
      <SidebarTrigger className="absolute top-0 left-0 p-5" />
      <span>Toggle sidebar (⌘+B)</span>
    </WrappedTooltip>
  );
}
