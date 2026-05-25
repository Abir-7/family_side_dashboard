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
  ChevronRight,
  User,
} from "lucide-react";

interface UserDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({
  isOpen,
  onOpenChange,
}: UserDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-sm p-0 gap-0 overflow-hidden rounded-2xl"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <User className="w-4 h-4 text-gray-500" />
            User details modal
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-3">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <Avatar className="h-12 w-12 rounded-xl">
              <AvatarImage src="https://i.pravatar.cc/150?img=11" />
              <AvatarFallback className="rounded-xl bg-gray-100 text-gray-600 font-semibold">
                SH
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Shahid Hasan Shimul
              </p>
              <p className="text-xs text-gray-400 mb-1">12/02/2009</p>
              <Badge className="bg-brand-400 text-white border-0 rounded-full text-[10px] px-2 py-0 font-medium">
                Father
              </Badge>
            </div>
          </div>

          {/* Email Card */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-0.5">Email Address</p>
              <p className="text-sm text-gray-800 font-medium">
                astark@starkindustries.com
              </p>
            </div>
          </div>

          {/* Location Card */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-0.5">Location</p>
              <p className="text-sm text-gray-800 font-medium leading-snug">
                8502 Preston Rd. Inglewood,
                <br />
                Maine 98380
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Reviews */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[11px] text-gray-500">Reviews</span>
              </div>
              <p className="text-lg font-bold text-brand-400 leading-none">
                32
              </p>
            </div>
            {/* Activities */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-brand-400" />
                <span className="text-[11px] text-gray-500">Activities</span>
              </div>
              <p className="text-lg font-bold text-brand-400 leading-none">
                12
              </p>
            </div>
            {/* Saved */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Bookmark className="w-4 h-4 text-brand-400 fill-brand-400" />
                <span className="text-[11px] text-gray-500">Saved item</span>
              </div>
              <p className="text-lg font-bold text-brand-400 leading-none">
                12
              </p>
            </div>
          </div>

          {/* Contributor Level */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm space-y-2">
            <p className="text-xs font-medium text-gray-500">
              Contributor level
            </p>
            <div className="flex items-center gap-2">
              <Progress
                value={91}
                className="h-2 flex-1 bg-[#9DC18336] [&>div]:bg-[#9DC183]"
              />
              <span className="text-[11px] text-gray-400 whitespace-nowrap">
                Top 9%
              </span>
            </div>
          </div>

          {/* Child Information */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium text-gray-500">
                Child Information
              </p>
              <Separator className="flex-1" />
            </div>

            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarImage src="https://i.pravatar.cc/150?img=47" />
                <AvatarFallback className="rounded-xl bg-brand-100 text-brand-600 font-semibold text-sm">
                  SH
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Shahid Hasan Shimul
                </p>
                <p className="text-xs text-gray-400 mb-1">12/02/2009</p>
                <Badge className="bg-brand-400 text-white border-0 rounded-full text-[10px] px-2 py-0 font-medium">
                  Male
                </Badge>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
