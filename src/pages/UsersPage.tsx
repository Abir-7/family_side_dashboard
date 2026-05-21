import { useState } from "react";
import { Eye, Ban, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { UserDetailsModal } from "@/components/custom/modal/UserDetailsModal";

type Subscription = "Free" | "Premium" | "Smart";
type Status = "Active" | "Suspend";

interface User {
  id: number;
  name: string;
  email: string;
  userType: string;
  location: string;
  joinDate: string;
  subscription: Subscription;
  status: Status;
}

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Olivia Rhye",
    email: "olivia@untitledui.com",
    userType: "User",
    location: "New York, UAS",
    joinDate: "05/04/2024",
    subscription: "Free",
    status: "Active",
  },
  {
    id: 2,
    name: "Phoenix Baker",
    email: "phoenix@untitledui.com",
    userType: "User",
    location: "London, UK",
    joinDate: "05/04/2024",
    subscription: "Premium",
    status: "Suspend",
  },
  {
    id: 3,
    name: "Lana Steiner",
    email: "lana@untitledui.com",
    userType: "User",
    location: "Berlin, Germany",
    joinDate: "05/04/2024",
    subscription: "Smart",
    status: "Active",
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    email: "demi@untitledui.com",
    userType: "User",
    location: "Paris, France",
    joinDate: "06/04/2024",
    subscription: "Premium",
    status: "Active",
  },
  {
    id: 5,
    name: "Candice Wu",
    email: "candice@untitledui.com",
    userType: "User",
    location: "Sydney, Australia",
    joinDate: "06/04/2024",
    subscription: "Free",
    status: "Active",
  },
  {
    id: 6,
    name: "Natali Craig",
    email: "natali@untitledui.com",
    userType: "User",
    location: "Toronto, Canada",
    joinDate: "07/04/2024",
    subscription: "Smart",
    status: "Active",
  },
  {
    id: 7,
    name: "Drew Cano",
    email: "drew@untitledui.com",
    userType: "User",
    location: "Tokyo, Japan",
    joinDate: "07/04/2024",
    subscription: "Smart",
    status: "Active",
  },
  {
    id: 8,
    name: "Orlando Diggs",
    email: "orlando@untitledui.com",
    userType: "User",
    location: "Madrid, Spain",
    joinDate: "08/04/2024",
    subscription: "Premium",
    status: "Active",
  },
  {
    id: 9,
    name: "Andi Lane",
    email: "andi@untitledui.com",
    userType: "User",
    location: "Rome, Italy",
    joinDate: "08/04/2024",
    subscription: "Smart",
    status: "Active",
  },
  {
    id: 10,
    name: "Kate Morrison",
    email: "kate@untitledui.com",
    userType: "User",
    location: "Dubai, UAE",
    joinDate: "09/04/2024",
    subscription: "Premium",
    status: "Active",
  },
  {
    id: 11,
    name: "Koray Okumus",
    email: "koray@untitledui.com",
    userType: "User",
    location: "Istanbul, Turkey",
    joinDate: "09/04/2024",
    subscription: "Free",
    status: "Active",
  },
  {
    id: 12,
    name: "Ava Wright",
    email: "ava@untitledui.com",
    userType: "User",
    location: "Singapore",
    joinDate: "10/04/2024",
    subscription: "Smart",
    status: "Active",
  },
  {
    id: 13,
    name: "Noah Miller",
    email: "noah@untitledui.com",
    userType: "User",
    location: "Amsterdam, Netherlands",
    joinDate: "10/04/2024",
    subscription: "Premium",
    status: "Suspend",
  },
  {
    id: 14,
    name: "Emma Davis",
    email: "emma@untitledui.com",
    userType: "User",
    location: "Seoul, South Korea",
    joinDate: "11/04/2024",
    subscription: "Free",
    status: "Active",
  },
  {
    id: 15,
    name: "Liam Johnson",
    email: "liam@untitledui.com",
    userType: "User",
    location: "Stockholm, Sweden",
    joinDate: "11/04/2024",
    subscription: "Smart",
    status: "Active",
  },
];

const subscriptionClass: Record<Subscription, string> = {
  Free: "bg-purple-100 text-purple-500 hover:bg-purple-100 border-0 rounded-full font-medium",
  Premium:
    "bg-amber-100  text-amber-500  hover:bg-amber-100  border-0 rounded-full font-medium",
  Smart:
    "bg-pink-100   text-pink-500   hover:bg-pink-100   border-0 rounded-full font-medium",
};

const statusClass: Record<Status, string> = {
  Active:
    "bg-green-100 text-green-600 hover:bg-green-100 border-0 rounded-full font-medium",
  Suspend:
    "bg-red-100   text-red-500   hover:bg-red-100   border-0 rounded-full font-medium",
};

type FilterOption = "All" | Subscription;

export default function UsersPage() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered =
    filter === "All"
      ? MOCK_USERS
      : MOCK_USERS.filter((u) => u.subscription === filter);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full h-8 px-4 text-sm font-medium gap-1.5 border-gray-200"
              >
                {filter === "All" ? "Users" : filter}
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {(["All", "Free", "Premium", "Smart"] as FilterOption[]).map(
                (opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={filter === opt ? "bg-muted font-medium" : ""}
                  >
                    {opt === "All" ? "All Users" : opt}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm font-semibold text-rose-400">
            {(12426).toLocaleString()} Users
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-gray-400 text-xs font-medium w-35 ">
                  Name
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-42.5">
                  Email address
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-30">
                  <span className="inline-flex items-center gap-1 cursor-pointer select-none">
                    User Type <ChevronDown className="w-3 h-3" />
                  </span>
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-35">
                  Location
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-27.5">
                  Join Date
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-30">
                  Subscribtion
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-25">
                  Status
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium w-20">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-gray-50 hover:bg-gray-50/60"
                >
                  <TableCell className="font-semibold text-sm text-gray-900 py-4 px-5">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400 py-4">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 text-center py-4">
                    {user.userType}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 py-4">
                    {user.location}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 py-4">
                    {user.joinDate}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={subscriptionClass[user.subscription]}>
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={statusClass[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">View user</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 hover:bg-gray-100 ${
                              user.status === "Suspend"
                                ? "text-red-400 hover:text-red-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {user.status === "Suspend" ? "Unsuspend" : "Suspend"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* User Detail Modal */}
        <UserDetailsModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </TooltipProvider>
  );
}
