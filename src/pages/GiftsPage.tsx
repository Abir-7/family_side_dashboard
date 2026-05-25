import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search, Plus, MapPin, Tag } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { GiftDetailModal } from "@/components/custom/modal/GiftDetailsModal";

interface Gift {
  id: number;
  image: string;
  name: string;
  createdBy: string;
  category: string;
  location: string;
  fee: string;
}

const MOCK_GIFTS: Gift[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Doctor",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Admin",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Admin",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "Provider",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=80&h=80&fit=crop",
    name: "Little Stars Pediatric Clinic",
    createdBy: "User",
    category: "Playgrounds",
    location: "New work, UAS",
    fee: "$00",
  },
];

export default function GiftsPage() {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<Gift[]>(MOCK_GIFTS);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Admin");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const filtered = gifts.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setGifts((prev) => prev.filter((g) => g.id !== id));
  };

  const handleView = (gift: Gift) => {
    setSelectedGift(gift);
    setIsDetailsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Role dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 text-sm font-medium text-gray-800 border border-gray-200 rounded-full gap-1.5 bg-white hover:bg-gray-50 shadow-none shrink-0"
              >
                {role}
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["Admin", "Provider", "User"].map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
        <div className="overflow-x-auto">
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
              {filtered.length === 0 ? (
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
                          src={gift.image}
                          alt={gift.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-800 leading-tight">
                          {gift.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Created By */}
                    <TableCell className="py-3 text-sm text-gray-500">
                      {gift.createdBy}
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
                      {gift.fee}
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

        {selectedGift && (
          <GiftDetailModal
            isOpen={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            gift={{
              name: selectedGift.name,
              location: selectedGift.location,
              price: selectedGift.fee,
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
