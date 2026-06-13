import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, MapPin, Tag, Loader2 } from "lucide-react";
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
import { Pagination } from "@/components/custom/pagination";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import { GiftDetailModal } from "@/components/custom/modal/GiftDetailsModal";

interface Gift {
  id: number;
  image_url: string | null;
  name: string;
  created_by: string;
  category: string;
  location: string;
  fee: number;
}

export default function GiftsPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);

  useEffect(() => {
    const fetchGifts = async () => {
      setIsLoading(true);
      try {
        const url = new URL("http://10.10.12.60:8015/api/v1/admin/gifts");
        url.searchParams.append("page", currentPage.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (result.status === "success") {
          setGifts(result.data.items);
          setTotalPages(Math.ceil(result.data.total / limit));
        } else {
          toast.error(result.message || "Failed to fetch gifts");
        }
      } catch (error) {
        console.error("Fetch gifts error:", error);
        toast.error("An error occurred while fetching gifts");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchGifts();
    }
  }, [accessToken, currentPage, limit]);

  const filtered = gifts.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/gifts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Gift deleted successfully");
        // Remove from local state
        setGifts((prev) => prev.filter((g) => g.id !== id));
      } else {
        toast.error(result.message || "Failed to delete gift");
      }
    } catch (error) {
      console.error("Delete gift error:", error);
      toast.error("An error occurred while deleting the gift");
    }
  };

  const handleView = (gift: Gift) => {
    setSelectedGiftId(gift.id);
    setIsDetailsModalOpen(true);
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
              placeholder="Search gift"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>

          {/* Create Gift Button */}
          <Button
            className="rounded-full h-11 px-4 text-sm font-semibold bg-brand-400 hover:bg-brand-500 text-white border-0 gap-1.5 shrink-0"
            onClick={() => navigate("/dashboard/gifts/create")}
          >
            Create gift
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
                <TableHead className="text-gray-400 text-xs px-5 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Create by
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Category
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Location
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Fee
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No gifts found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((gift) => (
                  <TableRow
                    key={gift.id}
                    className="border-gray-50 hover:bg-gray-50/60"
                  >
                    {/* Name */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={gift.image_url || "/assets/placeholder.png"}
                          alt={gift.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                        />
                        <span className="text-sm font-medium text-gray-800 leading-tight">
                          {gift.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Created By */}
                    <TableCell className="py-3 text-sm text-gray-500">
                      {gift.created_by}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        {gift.category}
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {gift.location}
                      </div>
                    </TableCell>

                    {/* Fee */}
                    <TableCell className="py-3 text-sm text-gray-500">
                      ${gift.fee.toFixed(2)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              onClick={() => handleView(gift)}
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
                              onClick={() => handleDelete(gift.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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

        <GiftDetailModal
          isOpen={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          giftId={selectedGiftId}
        />
      </div>
    </TooltipProvider>
  );
}
