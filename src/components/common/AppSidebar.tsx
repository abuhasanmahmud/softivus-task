"use client";

import * as React from "react";

import { NavMain } from "@/components/common/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <img src="/logo-color.png" width={150} className="mt-4" /> */}
        <img src="/logo-white.webp" width={150} className="mt-4 " />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
