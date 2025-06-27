"use client";

import { ChevronRight, Tags as TagsIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

import { SquareTerminal, LayoutDashboard, LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon; // ✅ this is the correct type
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

const navMain: NavItem[] = [
  {
    title: "Tasks",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      { title: "All tasks", url: "/" },
      { title: "Add task", url: "/tasks/new" },
    ],
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* Dashboard */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/">
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
