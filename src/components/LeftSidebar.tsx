"use client";
import { Settings, LayoutDashboard, Container, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vendors",
    url: "/dashboard/vendors",
    icon: Container,
  },
  {
    title: "Users",
    url: "/dashboard/add-user",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function LeftSidebar() {
  return (
    <Sidebar className="shadow-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vendor Hub</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        
          <SidebarMenuButton asChild onClick={() => signOut()}>
            <Button className="bg-red-500 text-white hover:bg-red-400 hover:text-white">
              Logout
            </Button>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
