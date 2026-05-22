import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { EventDetailsModal } from "@/components/custom/modal/EventDetailsModal";

interface Event {
  id: number;
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  tag: "Today" | "Tomorrow" | "Soon";
  description?: string;
  createdBy?: string;
  website?: string;
  whatsapp?: string;
  distance?: string;
  tags?: string[];
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    date: "16 May 2026",
    time: "11:00 PM",
    location: "Central Park, NY",
    tag: "Today",
    description: "Join us for a relaxing morning of yoga and mindfulness at Central Park. This event is open to all skill levels and ages. Please bring your own mat and water bottle.",
    createdBy: "Admin",
    website: "www.familyevents.com",
    whatsapp: "09839922",
    distance: "2.5 km",
    tags: ["Health", "Yoga", "Family", "Outdoor", "Wellness"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=80&h=80&fit=crop",
    title: "Kids Coding Workshop",
    date: "17 May 2026",
    time: "10:00 AM",
    location: "Tech Hub, SF",
    tag: "Tomorrow",
    description: "A fun, hands-on workshop for kids to learn the basics of coding using Scratch and Python.",
    createdBy: "Provider",
    website: "www.kidscoding.com",
    whatsapp: "09839923",
    distance: "5.0 km",
    tags: ["Education", "Coding", "Technology", "Workshop"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop",
    title: "Community Picnic",
    date: "20 May 2026",
    time: "12:00 PM",
    location: "Riverside Park",
    tag: "Soon",
    description: "Bring your favorite dish and join your neighbors for a day of food, music, and games at Riverside Park.",
    createdBy: "User",
    website: "www.communitypicnic.com",
    whatsapp: "09839924",
    distance: "1.2 km",
    tags: ["Social", "Community", "Food", "Outdoor"],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=80&h=80&fit=crop",
    title: "Art in the Park",
    date: "22 May 2026",
    time: "02:00 PM",
    location: "Downtown Plaza",
    tag: "Soon",
    description: "Explore local art and participate in interactive art sessions for all ages.",
    createdBy: "Admin",
    website: "www.artinthepark.com",
    whatsapp: "09839925",
    distance: "3.8 km",
    tags: ["Art", "Culture", "Family", "Outdoor"],
  },
];

const tagClass: Record<Event["tag"], string> = {
  Today: "bg-rose-100 text-rose-400 hover:bg-rose-100 border-0 rounded-full",
  Tomorrow: "bg-amber-100 text-amber-500 hover:bg-amber-100 border-0 rounded-full",
  Soon: "bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 rounded-full",
};

export default function EventsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filtered = MOCK_EVENTS.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>

          {/* Create Event Button */}
          <Button
            className="rounded-full h-9 px-4 text-sm font-semibold bg-rose-400 hover:bg-rose-500 text-white border-0 gap-1.5 shrink-0"
            onClick={() => navigate("/dashboard/events/create")}
          >
            Create Event
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-gray-400 text-xs font-medium w-75">
                  Event Title
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-30">
                  Date
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-32.5">
                  Time
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-37.5">
                  Location
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-20">
                  Status
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-20 text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-gray-50 hover:bg-gray-50/60"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {event.title}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                      {event.date}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.time}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.location}
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge className={`text-[11px] px-2.5 py-0.5 font-medium shrink-0 ${tagClass[event.tag]}`}>
                      {event.tag}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() => handleViewDetails(event)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">View</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <EventDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        event={selectedEvent || undefined}
      />
    </TooltipProvider>
  );
}
