import { Outlet, Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfileQuery, useUpdateProfileImageMutation } from "@/lib/redux/apis/userApi";
import { toast } from "sonner";
import { useRef } from "react";

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
  const { data: profileResponse, refetch } = useGetProfileQuery();
  const [updateProfileImage, { isLoading: isUploading }] = useUpdateProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateProfileImage(formData).unwrap();
      refetch();
      toast.success("Profile image updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile image");
    }

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none rounded-full">
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarImage src={profileResponse?.data?.image_url} />
                    <AvatarFallback>{profileResponse?.data?.name?.charAt(0) || "S"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="cursor-pointer gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Change Profile Image"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
