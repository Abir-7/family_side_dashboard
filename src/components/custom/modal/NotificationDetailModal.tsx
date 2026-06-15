import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, Calendar, Clock, PenLine, User as UserIcon } from "lucide-react";
import { useViewNotificationQuery, useApproveNotificationMutation, useRejectNotificationMutation } from "@/lib/redux/apis/notificationApi";
import { toast } from "sonner";

interface NotificationDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notificationId: number | null;
}

const InfoCell = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
    <p className="text-[12px] font-semibold text-gray-800 leading-tight">
      {value || "N/A"}
    </p>
  </div>
);

export function NotificationDetailModal({
  isOpen,
  onOpenChange,
  notificationId,
}: NotificationDetailModalProps) {
  const { data: response, isLoading } = useViewNotificationQuery(notificationId!, { skip: !isOpen || !notificationId });
  const [approveNotification, { isLoading: isApproving }] = useApproveNotificationMutation();
  const [rejectNotification, { isLoading: isRejecting }] = useRejectNotificationMutation();
  const data = response?.data;

  const handleApprove = async () => {
    if (!notificationId) return;
    try {
        await approveNotification(notificationId).unwrap();
        toast.success("Notification approved successfully");
        onOpenChange(false);
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to approve notification");
    }
  };

  const handleReject = async () => {
    if (!notificationId) return;
    try {
        await rejectNotification(notificationId).unwrap();
        toast.success("Notification rejected successfully");
        onOpenChange(false);
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to reject notification");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <UserIcon className="w-4 h-4 text-gray-500" />
            Item Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold text-gray-900">{data.name}</h2>
            <p className="text-[12px] text-gray-500">{data.description}</p>
            
            <div className="grid grid-cols-2 gap-2">
                <InfoCell icon={PenLine} label="Category" value={data.category} />
                <InfoCell icon={UserIcon} label="Creator Email" value={data.creator_email} />
                <InfoCell icon={Globe} label="Website" value={data.website} />
                <InfoCell icon={Calendar} label="Date Added" value={data.date} />
            </div>

            <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                <p className="text-[11px] font-medium text-gray-800">
                    {data.opening_days || ""} - {data.opening_hours || ""}
                </p>
            </div>
            
            {data.tags && (
              <div>
                <p className="text-[11px] font-semibold text-gray-800 mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                    {data.tags.map((tag: string) => <span key={tag} className="bg-brand-50 text-brand-600 text-[10px] px-2 py-0.5 rounded-full">{tag}</span>)}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter className="pt-4 flex flex-row gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="rounded-full px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive"
            className="rounded-full px-6"
            onClick={handleReject}
            disabled={isApproving || isRejecting}
          >
            {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
          <Button 
            type="button" 
            className="rounded-full px-6 bg-brand-400 hover:bg-brand-500 text-white"
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
          >
            {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
