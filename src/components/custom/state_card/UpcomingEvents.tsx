// components/dashboard/UpcomingEvents.tsx
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface UpcomingEvent {
  id: number;
  image: string;
  title: string;
  date: string;
  time: string;
  tag: "Today" | "Tomorrow" | "Soon";
}

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    date: "16 May 2026",
    time: "11:00 PM",
    tag: "Today",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    date: "16 May 2026",
    time: "11:00 PM",
    tag: "Today",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    date: "16 May 2026",
    time: "11:00 PM",
    tag: "Today",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    date: "16 May 2026",
    time: "11:00 PM",
    tag: "Today",
  },
];

const tagClass: Record<UpcomingEvent["tag"], string> = {
  Today: "bg-brand-100 text-brand-400 hover:bg-brand-100 border-0 rounded-full",
  Tomorrow:
    "bg-amber-100 text-amber-500 hover:bg-amber-100 border-0 rounded-full",
  Soon: "bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 rounded-full",
};

export function UpcomingEvents() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Upcoming Events
        </h2>
        <Link 
          to="/dashboard/events" 
          className="text-sm font-medium text-brand-400 underline underline-offset-2 hover:text-brand-500"
        >
          View all
        </Link>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-3">
        {UPCOMING_EVENTS.map((event) => (
          <div key={event.id} className="flex items-center gap-3">
            {/* Thumbnail */}
            <img
              src={event.image}
              alt={event.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate mb-1">
                {event.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                <span>{event.date}</span>
                <span className="text-gray-300">•</span>
                <span>{event.time}</span>
              </div>
            </div>

            {/* Tag */}
            <Badge
              className={`text-[11px] px-2.5 py-0.5 font-medium shrink-0 ${tagClass[event.tag]}`}
            >
              {event.tag}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
