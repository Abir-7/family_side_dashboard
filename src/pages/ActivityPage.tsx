import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
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
import { toast } from "sonner";
import { useGetActivitiesQuery, useDeleteActivityMutation, useLazyGetAllActivitiesQuery } from "@/lib/redux/apis/activityApi";
import type { Activity } from "@/types/activity";

export default function ActivityPage() {
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(10);
  
  const { data, isLoading } = useGetActivitiesQuery({ page: currentPage, limit, search: search || undefined });
  const [deleteActivity] = useDeleteActivityMutation();
  const [getAllActivities, { isFetching: isExporting }] = useLazyGetAllActivitiesQuery();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [selectedActivityName, setSelectedActivityName] = useState("");

  const activities = data?.data?.items || [];
  const totalPages = data ? Math.ceil(data.data.total / limit) : 1;
  
  const handleDeleteClick = (activity: Activity) => {
    setSelectedActivityId(activity.id);
    setSelectedActivityName(activity.name);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedActivityId) {
        try {
            await deleteActivity(selectedActivityId).unwrap();
            toast.success("Activity deleted successfully");
            setIsDeleteModalOpen(false);
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to delete activity");
        }
    }
  };

  const handleExport = async () => {
    try {
      const response = await getAllActivities().unwrap();
      const activitiesData = response?.data || [];
      if (activitiesData.length === 0) {
        toast.info("No data available to export");
        return;
      }

      const exportData = activitiesData.map((activity: any) => ({
        ID: activity.id,
        Name: activity.name,
        "Created By": activity.created_by,
        Category: activity.category,
        Location: activity.location,
        Fee: activity.fee,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
      XLSX.writeFile(workbook, "ActivitiesExport.xlsx");
      toast.success("Export successful");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export activities data");
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 min-h-[600px] flex flex-col relative">
        <div className="flex items-center justify-between p-5">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                    placeholder="Search activity"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
                />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-full h-11 px-4 text-sm font-medium gap-2 border-gray-200"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting ? "Exporting..." : "Export"}
              </Button>
              <Button
                className="gap-2 rounded-full h-11"
                onClick={() => navigate("/dashboard/activity/create")}
              >
                <Plus className="w-4 h-4" /> Add Activity
              </Button>
            </div>
        </div>

        {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
        )}

        <div className="flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600">Activity</TableHead>
                <TableHead className="font-semibold text-gray-600">Created By</TableHead>
                <TableHead className="font-semibold text-gray-600">Category</TableHead>
                <TableHead className="font-semibold text-gray-600">Location</TableHead>
                <TableHead className="font-semibold text-gray-600">Fee</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity: Activity) => (
                <TableRow key={activity.id} className="border-gray-50 hover:bg-gray-50/60">
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

                  <TableCell className="text-sm text-gray-500 py-3">{activity.created_by}</TableCell>
                  <TableCell className="text-sm text-gray-500 py-3">{activity.category}</TableCell>
                  <TableCell className="text-sm text-gray-500 py-3">{activity.location}</TableCell>
                  <TableCell className="text-sm text-gray-500 py-3">${activity.fee.toFixed(2)}</TableCell>

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
              {!isLoading && activities.length === 0 && (
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
        activityName={selectedActivityName}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
}
