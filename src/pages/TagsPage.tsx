import { useState } from "react";
import { Search, Pencil, Ban, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/custom/pagination";
import { CreateTagModal } from "@/components/custom/modal/create_tag";
import { UpdateTagModal } from "@/components/custom/modal/update_tag";
import { ConfirmationModal } from "@/components/custom/modal/confirmation_modal";
import { useGetTagsQuery, useToggleTagStatusMutation } from "@/lib/redux/apis/tagApi";
import { toast } from "sonner";

interface Tag {
  id: number;
  name: string;
  is_active: boolean;
}

const PAGE_SIZE = 20;

function TagCard({
  tag,
  onToggleStatus,
  onEdit,
}: {
  tag: Tag;
  onToggleStatus: (id: number) => void;
  onEdit: (tag: Tag) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <span className="flex-1 text-sm text-gray-700 font-medium truncate">
        {tag.name}
      </span>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onToggleStatus(tag.id)}
          title={tag.is_active ? "Set Inactive" : "Set Active"}
          className={`p-1.5 rounded-lg transition-colors ${
            !tag.is_active
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        <button
          onClick={() => onEdit(tag)}
          title="Edit"
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export default function TagsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetTagsQuery({ page: currentPage, limit: PAGE_SIZE });
  const [toggleTagStatus] = useToggleTagStatusMutation();

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const tags: Tag[] = data?.data?.items || [];
  const totalPages = data ? Math.ceil(data.data.total / PAGE_SIZE) : 1;

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedTag = tags.find((t) => t.id === selectedTagId);

  const handleStatusChangeRequest = (id: number) => {
    setSelectedTagId(id);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedTagId) {
        try {
            await toggleTagStatus(selectedTagId).unwrap();
            toast.success("Tag status updated successfully");
            setIsStatusModalOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to update status");
        }
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[600px] flex flex-col relative">
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
          />
        </div>
        <CreateTagModal />
      </div>

      <div className="flex-1 relative">
        {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
        )}
        {filtered.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No tags found.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filtered.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onToggleStatus={handleStatusChangeRequest}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {editingTag && (
          <UpdateTagModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            tagId={editingTag.id}
            initialData={{ name: editingTag.name }}
          />
      )}
      {selectedTag && (
          <ConfirmationModal
            isOpen={isStatusModalOpen}
            onOpenChange={setIsStatusModalOpen}
            title={selectedTag.is_active ? "Set Inactive" : "Set Active"}
            description={`Are you sure you want to set ${selectedTag.name} to ${selectedTag.is_active ? "inactive" : "active"}?`}
            onConfirm={confirmStatusChange}
            confirmLabel={selectedTag.is_active ? "Set Inactive" : "Set Active"}
            variant={selectedTag.is_active ? "destructive" : "default"}
          />
      )}
    </div>
  );
}
