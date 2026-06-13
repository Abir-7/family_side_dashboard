import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, Loader2 } from "lucide-react";
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

import { EventDetailsModal } from "@/components/custom/modal/EventDetailsModal";
import { DeleteEventModal } from "@/components/custom/modal/DeleteEventModal";
import { Pagination } from "@/components/custom/pagination";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

interface Event {
  id: number;
  name: string;
  image_url: string | null;
  created_by: string;
  category: string;
  location: string;
  fee: number;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventName, setSelectedEventName] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const url = new URL("http://10.10.12.60:8015/api/v1/admin/events");
        url.searchParams.append("page", currentPage.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (result.status === "success") {
          setEvents(result.data.items);
          setTotalPages(Math.ceil(result.data.total / limit));
        } else {
          toast.error(result.message || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Fetch events error:", error);
        toast.error("An error occurred while fetching events");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken, currentPage, limit]);

  const handleDeleteClick = (event: Event) => {
    setSelectedEventId(event.id);
    setSelectedEventName(event.name);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEventId || !accessToken) return;

    try {
      const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/events/${selectedEventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Event deleted successfully");
        // Remove from local state
        setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
        setIsDeleteModalOpen(false);
      } else {
        toast.error(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error("An error occurred while deleting the event");
    }
  };

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="overflow-x-auto min-h-[400px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-gray-400 text-xs font-medium w-75 px-5">
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
              {filteredEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-gray-50 hover:bg-gray-50/60"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image_url || "/assets/placeholder.png"}
                        alt={event.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {event.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.created_by}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.category}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {event.location}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    ${event.fee.toFixed(2)}
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedEventId(event.id);
                              setIsModalOpen(true);
                            }}
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
              {!isLoading && filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 pb-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <EventDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        eventId={selectedEventId}
      />
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        eventName={selectedEventName}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
}