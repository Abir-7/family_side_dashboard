import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MapPin,
  Star,
  Activity,
  Bookmark,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

interface Child {
  id: number;
  name: string;
  dob: string;
  gender: string;
}

interface UserDetail {
  id: number;
  full_name: string;
  email: string;
  role: string;
  join_date: string;
  location_name: string;
  status: string;
  subscription_plan: string;
  reviews_count: number;
  activities_count: number;
  saved_items_count: number;
  contributor_level: string;
  children: Child[];
}

interface UserDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
}

export function UserDetailsModal({
  isOpen,
  onOpenChange,
  userId,
}: UserDetailModalProps) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId || !accessToken) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setData(result.data);
        } else {
          toast.error(result.message || "Failed to fetch user details");
        }
      } catch (error) {
        console.error("Fetch user details error:", error);
        toast.error("An error occurred while fetching user details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && userId) {
      fetchDetails();
    }
  }, [isOpen, userId, accessToken]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-sm p-0 gap-0 overflow-hidden rounded-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <UserIcon className="w-4 h-4 text-gray-500" />
            User details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : data ? (
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <Avatar className="h-12 w-12 rounded-xl">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${data.email}`} />
                <AvatarFallback className="rounded-xl bg-gray-100 text-gray-600 font-semibold">
                  {data.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {data.full_name}
                </p>
                <p className="text-xs text-gray-400 mb-1">{data.join_date}</p>
                <Badge className="bg-brand-400 text-white border-0 rounded-full text-[10px] px-2 py-0 font-medium">
                  {data.role}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Email Address</p>
                <p className="text-sm text-gray-800 font-medium truncate max-w-[250px]">
                  {data.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Location</p>
                <p className="text-sm text-gray-800 font-medium leading-snug">
                  {data.location_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] text-gray-500">Reviews</span>
                </div>
                <p className="text-lg font-bold text-brand-400 leading-none">
                  {data.reviews_count}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-brand-400" />
                  <span className="text-[11px] text-gray-500">Activities</span>
                </div>
                <p className="text-lg font-bold text-brand-400 leading-none">
                  {data.activities_count}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Bookmark className="w-4 h-4 text-brand-400 fill-brand-400" />
                  <span className="text-[11px] text-gray-500">Saved</span>
                </div>
                <p className="text-lg font-bold text-brand-400 leading-none">
                  {data.saved_items_count}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm space-y-2">
              <p className="text-xs font-medium text-gray-500">
                Contributor level
              </p>
              <div className="flex items-center gap-2">
                <Progress
                  value={50} // Placeholder, API does not return a numeric value
                  className="h-2 flex-1 bg-[#9DC18336] [&>div]:bg-[#9DC183]"
                />
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {data.contributor_level}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium text-gray-500">
                  Child Information
                </p>
                <Separator className="flex-1" />
              </div>
              {data.children.length > 0 ? (
                data.children.map(child => (
                    <div key={child.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm mb-2">
                    <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarFallback className="rounded-xl bg-brand-100 text-brand-600 font-semibold text-sm">
                        {child.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                        {child.name}
                        </p>
                        <p className="text-xs text-gray-400 mb-1">{child.dob}</p>
                        <Badge className="bg-brand-400 text-white border-0 rounded-full text-[10px] px-2 py-0 font-medium">
                        {child.gender}
                        </Badge>
                    </div>
                    </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4 text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No child information available
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
