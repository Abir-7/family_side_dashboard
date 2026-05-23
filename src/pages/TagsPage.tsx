import { useState } from "react";
import { Search, Pencil, Trash2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/custom/pagination";
import { CreateTagModal } from "@/components/custom/modal/create_tag";
import { UpdateTagModal } from "@/components/custom/modal/update_tag";
import { ConfirmationModal } from "@/components/custom/modal/confirmation_modal";

interface Tag {
  id: number;
  name: string;
  active: boolean;
}

const ALL_TAGS: Tag[] = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  name: "Tag Name",
  active: true,
}));

const PAGE_SIZE = 28;

function TagCard({
  tag,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  tag: Tag;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      {/* Name */}
      <span className="flex-1 text-sm text-gray-700 font-medium truncate">
        {tag.name}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Toggle Status */}
        <button
          onClick={() => onToggleStatus(tag.id)}
          title={tag.active ? "Set Inactive" : "Set Active"}
          className={`p-1.5 rounded-lg transition-colors ${
            !tag.active
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(tag.id)}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(tag.id)}
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
  const [tags, setTags] = useState<Tag[]>(ALL_TAGS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectedTag = tags.find((t) => t.id === selectedTagId);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (id: number) => {
    setSelectedTagId(id);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedTagId) {
      setTags((prev) =>
        prev.map((t) => (t.id === selectedTagId ? { ...t, active: !t.active } : t)),
      );
    }
  };

  const handleDelete = (id: number) => {
    setSelectedTagId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTagId) {
      setTags((prev) => prev.filter((t) => t.id !== selectedTagId));
    }
  };

  const handleEdit = (id: number) => {
    setSelectedTagId(id);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[600px] flex flex-col">
      {/* Toolbar */}
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

      {/* Grid */}
      <div className="flex-1">
        {paginated.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No tags found.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {paginated.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onToggleStatus={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedTag && (
        <>
          <UpdateTagModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            initialData={{ name: selectedTag.name }}
          />
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title="Delete Tag"
            description={`Are you sure you want to delete ${selectedTag.name}? This action cannot be undone.`}
            onConfirm={confirmDelete}
            confirmLabel="Delete"
            variant="destructive"
          />
          <ConfirmationModal
            isOpen={isStatusModalOpen}
            onOpenChange={setIsStatusModalOpen}
            title={selectedTag.active ? "Set Inactive" : "Set Active"}
            description={`Are you sure you want to set ${selectedTag.name} to ${selectedTag.active ? "inactive" : "active"}?`}
            onConfirm={confirmStatusChange}
            confirmLabel={selectedTag.active ? "Set Inactive" : "Set Active"}
          />
        </>
      )}
    </div>
  );
}
