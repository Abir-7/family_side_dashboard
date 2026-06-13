import { useState, useEffect } from "react";
import { Eye, Ban, ChevronDown, Loader2 } from "lucide-react";
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
import { BlockUserModal } from "@/components/custom/modal/BlockUserModal";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import { Pagination } from "@/components/custom/pagination";

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  location: string;
  join_date: string;
  subscription: string;
  status: string;
}

const subscriptionClass: Record<string, string> = {
  Free: "bg-purple-100 text-purple-500 hover:bg-purple-100 border-0 rounded-full font-medium text-[10px] px-2 py-0",
  Premium:
    "bg-amber-100  text-amber-500  hover:bg-amber-100  border-0 rounded-full font-medium text-[10px] px-2 py-0",
  Smart:
    "bg-pink-100   text-pink-500   hover:bg-pink-100   border-0 rounded-full font-medium text-[10px] px-2 py-0",
};

const statusClass: Record<string, string> = {
  Active:
    "bg-green-100 text-green-600 hover:bg-green-100 border-0 rounded-full font-medium text-[10px] px-2 py-0",
  Suspend:
    "bg-red-100   text-red-500   hover:bg-red-100   border-0 rounded-full font-medium text-[10px] px-2 py-0",
  Blocked:
    "bg-red-100   text-red-500   hover:bg-red-100   border-0 rounded-full font-medium text-[10px] px-2 py-0",
};

type FilterOption = "All" | "Free" | "Premium" | "Smart";

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<FilterOption>("All");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedUserForBlock, setSelectedUserForBlock] = useState<User | null>(
    null,
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const url = new URL("http://10.10.12.60:8015/api/v1/admin/users");
        url.searchParams.append("page", currentPage.toString());
        url.searchParams.append("limit", limit.toString());
        if (filter !== "All") {
          url.searchParams.append("subscription", filter);
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (result.status === "success") {
          setUsers(result.data.users);
          setTotalUsers(result.data.total);
          setTotalPages(Math.ceil(result.data.total / limit));
        } else {
          toast.error(result.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Fetch users error:", error);
        toast.error("An error occurred while fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken, currentPage, limit, filter]);

  const handleViewUser = (user: User) => {
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };


  const handleBlockClick = (user: User) => {
    setSelectedUserForBlock(user);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUserForBlock || !accessToken) return;

    const isCurrentlyBlocked = selectedUserForBlock.status === "Blocked";
    const actionParam = isCurrentlyBlocked ? "activate" : "block";
    const actionDisplayName = isCurrentlyBlocked ? "unblock" : "block";

    try {
      const response = await fetch(`http://10.10.12.60:8015/api/v1/admin/users/${selectedUserForBlock.id}/action`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action: actionParam }),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success(`User ${actionDisplayName}ed successfully`);
        
        // Force a re-fetch of the user list. 
        // We'll use a functional state update to trigger a re-render/re-fetch.
        // A better approach is to have a dedicated trigger state, but this should work for now.
        // Alternatively, we can just update the local users array directly if we want instant feedback.
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === selectedUserForBlock.id 
              ? { ...u, status: isCurrentlyBlocked ? "Active" : "Blocked" } 
              : u
          )
        );
        
        setIsBlockModalOpen(false);
      } else {
        toast.error(result.message || `Failed to ${actionDisplayName} user`);
      }
    } catch (error) {
      console.error(`${actionDisplayName} error:`, error);
      toast.error(`An error occurred while ${actionDisplayName}ing the user`);
    }
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
                className="rounded-full h-11 px-4 text-sm font-medium gap-1.5 border-gray-200"
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
                    onClick={() => {
                      setFilter(opt);
                      setCurrentPage(1);
                    }}
                    className={filter === opt ? "bg-muted font-medium" : ""}
                  >
                    {opt === "All" ? "All Users" : opt}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm font-semibold text-brand-400">
            {totalUsers.toLocaleString()} Users
          </span>
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
                <TableHead className="text-gray-400 text-xs font-medium px-5">
                  Name
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Email address
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  User Type
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Location
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Join Date
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Subscription
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-400 text-xs font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
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
                  <TableCell className="text-sm text-gray-500 py-4">
                    {user.user_type}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 py-4 max-w-[200px] truncate">
                    {user.location}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 py-4">
                    {user.join_date}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={subscriptionClass[user.subscription] || subscriptionClass.Free}>
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={statusClass[user.status] || statusClass.Active}>
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
                              user.status === "Blocked"
                                ? "text-red-400 hover:text-red-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            onClick={() => handleBlockClick(user)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {user.status === "Blocked" ? "Unblock" : "Block"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No users found
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

        {/* User Detail Modal */}
        <UserDetailsModal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen} 
          userId={selectedUserId}
        />

        {/* Block User Modal */}
        <BlockUserModal
          isOpen={isBlockModalOpen}
          onOpenChange={setIsBlockModalOpen}
          userName={selectedUserForBlock?.name || ""}
          isSuspended={selectedUserForBlock?.status === "Blocked"}
          onConfirm={handleConfirmBlock}
        />
      </div>
    </TooltipProvider>
  );
}
