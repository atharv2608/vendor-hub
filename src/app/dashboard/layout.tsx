"use client";
import { LeftSidebar } from "@/components/LeftSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, toggleTheme } = useTheme();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <LeftSidebar />
        <main className="w-full">
          <div className="flex p-2 bg-white shadow-md dark:bg-gray-800 sticky top-0 z-10">
            <div className="mr-auto">
              <SidebarTrigger />
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default DashboardLayout;
