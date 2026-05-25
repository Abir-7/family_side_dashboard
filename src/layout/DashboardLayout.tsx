import { Outlet, Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Welcome back to your dashboard" },
  "/dashboard/users": { title: "Users", subtitle: "Manage your system users" },
  "/dashboard/events": { title: "Events", subtitle: "Track and manage upcoming events" },
  "/dashboard/events/create": { title: "Create Event", subtitle: "Add a new event to the calendar" },
  "/dashboard/gifts": { title: "Gifts", subtitle: "Manage your gift registry" },
  "/dashboard/gifts/create": { title: "Create Gift", subtitle: "Add a new item to your registry" },
  "/dashboard/category": { title: "Categories", subtitle: "Organize items into categories" },
  "/dashboard/sub-category": { title: "Sub-Categories", subtitle: "Organize items into sub-categories" },
  // "/dashboard/tags": { title: "Tags", subtitle: "Manage your system tags" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account and app settings" },
  "/dashboard/activity": { title: "Activity", subtitle: "Track recent system activities" },
  "/dashboard/activity/create": { title: "Create Activity", subtitle: "Add a new activity record" },
  "/dashboard/notifications": { title: "Notifications", subtitle: "Check your latest updates" },
};

export default function DashboardLayout() {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] || { title: "Dashboard", subtitle: "Management portal" };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-800">{info.title}</h1>
              <p className="text-sm text-gray-400">{info.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
