import { LayoutDashboard, Users, Activity, Settings, LogOut, CalendarDays } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import { logout } from "../../lib/redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Events", url: "/dashboard/events", icon: CalendarDays },
  { title: "Activity", url: "/dashboard/activity", icon: Activity },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center px-6">
        <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">
          Family Admin
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
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
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
