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

import { ActivityDetailsModal } from "@/components/custom/modal/ActivityDetailsModal";
import { DeleteActivityModal } from "@/components/custom/modal/DeleteActivityModal";
import { Pagination } from "@/components/custom/pagination";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

interface Activity {
  id: number;
  image_url: string | null;
  name: string;
  created_by: string;
  category: string;
  location: string;
  fee: number;
}

export default function ActivityPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const url = new URL("http://10.10.12.60:8015/api/v1/admin/activities");
        url.searchParams.append("page", currentPage.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (result.status === "success") {
          setActivities(result.data.items);
          setTotalPages(Math.ceil(result.data.total / limit));
        } else {
          toast.error(result.message || "Failed to fetch activities");
        }
      } catch (error) {
        console.error("Fetch activities error:", error);
        toast.error("An error occurred while fetching activities");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchActivities();
    }
  }, [accessToken, currentPage, limit]);

  const handleDeleteClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivity || !accessToken) return;

    try {
      const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/activities/${selectedActivity.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Activity deleted successfully");
        // Remove from local state
        setActivities((prev) => prev.filter((a) => a.id !== selectedActivity.id));
        setIsDeleteModalOpen(false);
      } else {
        toast.error(result.message || "Failed to delete activity");
      }
    } catch (error) {
      console.error("Delete activity error:", error);
      toast.error("An error occurred while deleting the activity");
    }
  };

  const filteredActivities = activities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
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
              placeholder="Search activities"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>

          {/* Create Activity Button */}
          <Button
            className="rounded-full h-11 px-4 text-sm font-semibold bg-brand-400 hover:bg-brand-500 text-white border-0 gap-1.5 shrink-0"
            onClick={() => navigate("/dashboard/activity/create")}
          >
            Create activity
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
                  Create by
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
              {filteredActivities.map((activity) => (
                <TableRow
                  key={activity.id}
                  className="border-gray-50 hover:bg-gray-50/60"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={activity.image_url || "/assets/placeholder.png"}
                        alt={activity.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {activity.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.created_by}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.category}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.location}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    ${activity.fee.toFixed(2)}
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
                              setSelectedActivityId(activity.id);
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
                            onClick={() => handleDeleteClick(activity)}
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
              {!isLoading && filteredActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No activities found
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
      <ActivityDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        activityId={selectedActivityId}
      />
      <DeleteActivityModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        activityName={selectedActivity?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
}