"use client";

import { Calendar, ShoppingBag, Gift, X, Eye, Loader2, Check } from "lucide-react";
import { useGetNotificationsQuery, useRejectNotificationMutation, useApproveNotificationMutation } from "@/lib/redux/apis/notificationApi";
import { NotificationDetailModal } from "@/components/custom/modal/NotificationDetailModal";
import { useState } from "react";
import { toast } from "sonner";

type NotificationType = "event" | "activity" | "gift";

interface NotificationItem {
  id: number;
  title: string;
  subtitle: string;
  item_type: NotificationType;
  item_id: number;
  is_read: boolean;
  time_label: string;
}

const iconMap: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  event: {
    icon: Calendar,
    bg: "bg-blue-100",
    color: "text-blue-500",
  },
  activity: {
    icon: ShoppingBag,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
  gift: {
    icon: Gift,
    bg: "bg-purple-100",
    color: "text-purple-500",
  },
};

function NotificationCard({
  notification,
  onView,
  onApprove,
  onReject,
}: {
  notification: NotificationItem;
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const { icon: Icon, bg, color } = iconMap[notification.item_type] || iconMap.event;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${bg} flex-shrink-0`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {notification.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{notification.time_label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{notification.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          onClick={() => onView(notification.id)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 active:scale-95"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <button
          onClick={() => onApprove(notification.id)}
          className="flex items-center gap-1.5 rounded-lg border border-brand-400 px-4 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 active:scale-95"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={() => onReject(notification.id)}
          className="flex items-center gap-1.5 rounded-lg border border-red-400 px-4 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 active:scale-95"
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [currentPage] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: currentPage, limit });
  const [approveNotification] = useApproveNotificationMutation();
  const [rejectNotification] = useRejectNotificationMutation();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

  const notifications: NotificationItem[] = data?.data?.notifications || [];

  const handleView = (id: number) => {
    setSelectedNotificationId(id);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
        await approveNotification(id).unwrap();
        toast.success("Notification approved successfully");
        refetch();
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to approve notification");
    }
  };
  
  const handleReject = async (id: number) => {
    try {
        await rejectNotification(id).unwrap();
        toast.success("Notification rejected successfully");
        refetch();
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to reject notification");
    }
  };

  return (
    <div className="space-y-4 p-6 relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
      )}
      {notifications.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            You have no new notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
      
      <NotificationDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        notificationId={selectedNotificationId}
      />
    </div>
  );
}
