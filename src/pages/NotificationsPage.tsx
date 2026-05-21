"use client";

import { useState } from "react";
import { Calendar, ShoppingBag, Gift, X, Eye } from "lucide-react";

type NotificationType = "event" | "activity" | "gift";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  time: string;
  message: string;
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

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "event",
    title: "New Event Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
  {
    id: 2,
    type: "activity",
    title: "New Activity Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
  {
    id: 3,
    type: "gift",
    title: "New Gift Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
  {
    id: 4,
    type: "event",
    title: "New Event Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
  {
    id: 5,
    type: "event",
    title: "New Event Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
  {
    id: 6,
    type: "event",
    title: "New Event Added",
    time: "Tuesday 2:00 PM",
    message: "John Doe want to Join",
  },
];

function NotificationCard({
  notification,
  onView,
  onReject,
}: {
  notification: Notification;
  onView: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const { icon: Icon, bg, color } = iconMap[notification.type];

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
          <p className="text-xs text-gray-400 mt-0.5">{notification.time}</p>
          <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          onClick={() => onView(notification.id)}
          className="flex items-center gap-1.5 rounded-lg border border-green-500 px-4 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 active:scale-95"
        >
          <Eye className="h-3.5 w-3.5" />
          View
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
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [dismissing, setDismissing] = useState<Set<number>>(new Set());

  const remove = (id: number) => {
    setDismissing((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setDismissing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  const handleView = (id: number) => remove(id);
  const handleReject = (id: number) => remove(id);

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Notifications
      </h1>

      {notifications.length === 0 ? (
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
            <div
              key={notification.id}
              className="transition-all duration-300"
              style={{
                opacity: dismissing.has(notification.id) ? 0 : 1,
                transform: dismissing.has(notification.id)
                  ? "translateX(16px)"
                  : "translateX(0)",
              }}
            >
              <NotificationCard
                notification={notification}
                onView={handleView}
                onReject={handleReject}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
