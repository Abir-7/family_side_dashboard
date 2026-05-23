// components/dashboard/RecentFlaggedItems.tsx
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FlaggedItem {
  id: number;
  image: string;
  title: string;
  type: "Event" | "Activity" | "Post";
  reason: string;
  time: string;
}

const FLAGGED_ITEMS: FlaggedItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    type: "Event",
    reason: "Inappropriate content",
    time: "1hr ago",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    type: "Event",
    reason: "Inappropriate content",
    time: "1hr ago",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    type: "Event",
    reason: "Inappropriate content",
    time: "1hr ago",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    type: "Event",
    reason: "Inappropriate content",
    time: "1hr ago",
  },
];

export function RecentFlaggedItems() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Recent flagged items
        </h2>
        <button className="text-sm font-medium text-brand-400 underline underline-offset-2 hover:text-brand-500">
          View all
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {FLAGGED_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Thumbnail */}
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {item.title}
                </span>
                <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-0 rounded-full text-[10px] px-2 py-0 font-medium shrink-0">
                  {item.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">{item.reason}</p>
            </div>

            {/* Time + Eye */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs text-gray-400">{item.time}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
