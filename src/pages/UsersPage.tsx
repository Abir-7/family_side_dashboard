import { useState } from "react";
import { Eye, Ban, ChevronDown, Loader2, Download } from "lucide-react";
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
import { toast } from "sonner";
import { Pagination } from "@/components/custom/pagination";
import {
  useGetUsersQuery,
  useBlockUserMutation,
  useLazyGetAllUsersQuery,
} from "@/lib/redux/apis/userApi";
import * as XLSX from "xlsx";

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

type FilterOption = "All" | "Family" | "Provider";

export default function UsersPage() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit,
    user_type: filter === "All" ? undefined : filter.toLowerCase(),
  });

  const [blockUser] = useBlockUserMutation();
  const [getAllUsers, { isFetching: isExporting }] = useLazyGetAllUsersQuery();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedUserForBlock, setSelectedUserForBlock] = useState<any | null>(
    null,
  );

  const handleViewUser = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleBlockClick = (user: any) => {
    setSelectedUserForBlock(user);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedUserForBlock) return;

    const action =
      selectedUserForBlock.status === "Blocked" ? "activate" : "block";
    const actionDisplayName =
      selectedUserForBlock.status === "Blocked" ? "unblock" : "block";

    try {
      await blockUser({ id: selectedUserForBlock.id, action }).unwrap();
      toast.success(`User ${actionDisplayName}ed successfully`);
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error(`${actionDisplayName} error:`, error);
      toast.error(`An error occurred while ${actionDisplayName}ing the user`);
    }
  };

  const handleExport = async () => {
    try {
      const response = await getAllUsers().unwrap();
      const usersData = response?.data || [];
      if (usersData.length === 0) {
        toast.info("No data available to export");
        return;
      }

      const exportData = usersData.map((user: any) => ({
        ID: user.id,
        "Full Name": user.full_name || user.name,
        Email: user.email,
        Role: user.role || user.user_type,
        "Join Date": user.join_date,
        Location: user.location_name || user.location,
        Status: user.status,
        "Subscription Plan": user.subscription_plan || user.subscription,
        "Activities Count": user.activities_count || 0,
        "Reviews Count": user.reviews_count || 0,
        "Saved Items Count": user.saved_items_count || 0,
        "Children Count": user.children ? user.children.length : 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "UsersExport.xlsx");
      toast.success("Export successful");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users data");
    }
  };

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.total || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[calc(100vh-115px)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-4 text-sm font-medium gap-1.5 border-gray-200"
                >
                  {filter === "All" ? "User Type" : filter}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {(["All", "Family", "Provider"] as FilterOption[]).map(
                  (opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => {
                        setFilter(opt);
                        setCurrentPage(1);
                      }}
                      className={filter === opt ? "bg-muted font-medium" : ""}
                    >
                      {opt}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="rounded-full h-11 px-4 text-sm font-medium gap-2 border-gray-200"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>

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
              {users.map((user: any) => (
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
                    <Badge
                      className={
                        subscriptionClass[user.subscription] ||
                        subscriptionClass.Free
                      }
                    >
                      {user.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={statusClass[user.status] || statusClass.Active}
                    >
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
                            onClick={() => handleViewUser(user.id)}
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
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-gray-500"
                  >
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
