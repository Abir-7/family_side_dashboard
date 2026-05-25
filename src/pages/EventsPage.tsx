import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Trash2,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EventDetailsModal } from "@/components/custom/modal/EventDetailsModal";
import { DeleteEventModal } from "@/components/custom/modal/DeleteEventModal";

interface Event {
  id: number;
  image: string;
  title: string;
  createdBy: string;
  category: string;
  location: string;
  fee: string;
  date: string;
  time: string;
  tag: "Today" | "Tomorrow" | "Soon";
  description?: string;
  website?: string;
  whatsapp?: string;
  distance?: string;
  tags?: string[];
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    title: "Family Yoga Day",
    createdBy: "Admin",
    category: "Health",
    location: "Central Park, NY",
    fee: "$20",
    date: "16 May 2026",
    time: "11:00 PM",
    tag: "Today",
    description:
      "Join us for a relaxing morning of yoga and mindfulness at Central Park. This event is open to all skill levels and ages. Please bring your own mat and water bottle.",
    website: "www.familyevents.com",
    whatsapp: "09839922",
    distance: "2.5 km",
    tags: ["Health", "Yoga", "Family", "Outdoor", "Wellness"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=80&h=80&fit=crop",
    title: "Kids Coding Workshop",
    createdBy: "Provider",
    category: "Education",
    location: "Tech Hub, SF",
    fee: "$45",
    date: "17 May 2026",
    time: "10:00 AM",
    tag: "Tomorrow",
    description:
      "A fun, hands-on workshop for kids to learn the basics of coding using Scratch and Python.",
    website: "www.kidscoding.com",
    whatsapp: "09839923",
    distance: "5.0 km",
    tags: ["Education", "Coding", "Technology", "Workshop"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop",
    title: "Community Picnic",
    createdBy: "User",
    category: "Social",
    location: "Riverside Park",
    fee: "Free",
    date: "20 May 2026",
    time: "12:00 PM",
    tag: "Soon",
    description:
      "Bring your favorite dish and join your neighbors for a day of food, music, and games at Riverside Park.",
    website: "www.communitypicnic.com",
    whatsapp: "09839924",
    distance: "1.2 km",
    tags: ["Social", "Community", "Food", "Outdoor"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=80&h=80&fit=crop",
    title: "Art in the Park",
    createdBy: "Admin",
    category: "Art",
    location: "Downtown Plaza",
    fee: "$10",
    date: "22 May 2026",
    time: "02:00 PM",
    tag: "Soon",
    description:
      "Explore local art and participate in interactive art sessions for all ages.",
    website: "www.artinthepark.com",
    whatsapp: "09839925",
    distance: "3.8 km",
    tags: ["Art", "Culture", "Family", "Outdoor"],
  },
];

type FilterOption = "Admin" | "User" | "Provider" | "All";

export default function EventsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterOption>("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filtered = MOCK_EVENTS.filter((e) => {
    const matchFilter = filter === "All" || e.createdBy === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEvent) {
      console.log(`Deleting event: ${selectedEvent.title}`);
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full h-11 px-4 text-sm font-medium gap-1.5 border-gray-200 shrink-0"
              >
                {filter === "All" ? "All" : filter}
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {(["All", "Admin", "Provider", "User"] as FilterOption[]).map(
                (opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={filter === opt ? "bg-muted font-medium" : ""}
                  >
                    {opt}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>

          {/* Create Event Button */}
          <Button
            className="rounded-full h-11 px-4 text-sm font-semibold bg-brand-400 hover:bg-brand-500 text-white border-0 gap-1.5 shrink-0"
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
                <TableHead className="text-gray-400 text-xs px-5 font-medium w-75">
                  Name
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-30">
                  Created by
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-32.5">
                  Category
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-37.5">
                  Location
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-20">
                  Fee
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
                    {event.createdBy}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.category}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.location}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.fee}
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
                            className="h-8 w-8 text-brand-400 hover:text-brand-600 hover:bg-brand-50"
                            onClick={() => handleDeleteClick(event)}
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
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        eventName={selectedEvent?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
}
