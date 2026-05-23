import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, ChevronDown } from "lucide-react";
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

import { ActivityDetailsModal } from "@/components/custom/modal/ActivityDetailsModal";

type CreatedBy = "Provider" | "User" | "Admin";

interface Activity {
  id: number;
  image: string;
  name: string;
  createdBy: CreatedBy;
  category: string;
  location: string;
  fee: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Doctor",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Admin",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Admin",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
];

type FilterOption = "Admin" | "User" | "Provider" | "All";

export default function ActivityPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterOption>("Admin");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = MOCK_ACTIVITIES.filter((a) => {
    const matchFilter = filter === "All" || a.createdBy === filter;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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
              placeholder="Search user"
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-gray-400 text-xs font-medium w-75">
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
              {filtered.map((activity) => (
                <TableRow
                  key={activity.id}
                  className="border-gray-50 hover:bg-gray-50/60"
                >
                  {/* Name with image */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {activity.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.createdBy}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.category}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.location}
                  </TableCell>

                  <TableCell className="text-sm text-gray-500 py-3">
                    {activity.fee}
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() => setIsModalOpen(true)}
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
      <ActivityDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </TooltipProvider>
  );
}
