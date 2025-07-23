// Updated AppSidebar component
"use client";

import * as React from "react";
import {
  LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import DefaultImage from "@/public/default.jpg";
import { SidebarHeaderComponent } from "./sidebar-header";

interface IHeaderData {
  team: {
    name: string;
    logo: React.ElementType;
    plan: string;
  };
}
interface IUserData {
  name?: string;
  email: string;
  id?: string;
  userId?: string;
  isVerified?: boolean;
  role?: string;
}
interface INavMainData {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  headerData: IHeaderData;
  userData: IUserData;
  navMainData: INavMainData;
}

export function AppSidebar({
  headerData,
  userData,
  navMainData,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderComponent team={headerData.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData.name || "Anonymous User",
            email: userData.email,
            avatar: DefaultImage.src, // fallback avatar
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
