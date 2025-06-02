import * as React from "react";
import { useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { NavUser } from "~/components/nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  useEffect(() => {
    const activeSidebarButton = document.querySelector(
      '[data-sidebar="menu-sub-button"][data-status="active"]',
    );

    if (activeSidebarButton) {
      activeSidebarButton.scrollIntoView({
        block: "nearest",
      });
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <NavOrganization /> */}</SidebarHeader>

      <SidebarContent className="gap-0! mt-3">
        {/* <NavBoards />
        <NavNotes /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
