import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  LogOut,
  CalendarDays,
  Gift,
  LayoutGrid,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import { logout } from "../../lib/redux/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Activity", url: "/dashboard/activity", icon: Activity },
  { title: "Event", url: "/dashboard/events", icon: CalendarDays },
  { title: "Gift", url: "/dashboard/gifts", icon: Gift },
  { title: "Category", url: "/dashboard/category", icon: LayoutGrid },
  { title: "Sub-Category", url: "/dashboard/sub-category", icon: LayoutGrid },
  { title: "Tag", url: "/dashboard/tags", icon: Tag },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const isActive = (url: string, exact?: boolean) =>
    exact
      ? location.pathname === url
      : location.pathname === url || location.pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="h-16 border-b flex justify-center items-center  group-data-[collapsible=icon]:h-12  group-data-[collapsible=icon]:px-2 px-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-8 w-auto group-data-[collapsible=icon]:hidden"
        />
        <img
          src="/logo_icon.png"
          alt="Logo Icon"
          className=" w-auto hidden group-data-[collapsible=icon]:block"
        />
      </SidebarHeader>

      <SidebarContent className="pt-3">
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className={cn(
                        "h-11 rounded-xl px-4 gap-3 text-sm font-medium transition-colors w-full",
                        active
                          ? "bg-rose-400! text-white! hover:bg-rose-400! hover:text-white!"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={cn(
                            "w-5 h-5 shrink-0",
                            active ? "text-white" : "text-gray-500",
                          )}
                          strokeWidth={1.6}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="h-11 rounded-xl px-4 gap-3 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.6} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
