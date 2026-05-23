import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/custom/pagination";

interface Tag {
  id: number;
  name: string;
  blocked: boolean;
}

const ALL_TAGS: Tag[] = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  name: "Tag Name",
  blocked: false,
}));

const PAGE_SIZE = 28;

function TagCard({
  tag,
  onBlock,
  onDelete,
  onEdit,
}: {
  tag: Tag;
  onBlock: (id: number) => void;
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
        {/* Block */}
        <button
          onClick={() => onBlock(tag.id)}
          title={tag.blocked ? "Unblock" : "Block"}
          className={`p-1.5 rounded-lg transition-colors ${
            tag.blocked
              ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
              : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
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

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleBlock = (id: number) => {
    setTags((prev) =>
      prev.map((t) => (t.id === id ? { ...t, blocked: !t.blocked } : t)),
    );
  };

  const handleDelete = (id: number) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (id: number) => {
    console.log("Edit tag", id);
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
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
          />
        </div>
        <Button className="h-9 px-4 rounded-lg bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold gap-1.5 shadow-none">
          Create tag
          <Plus className="w-4 h-4" />
        </Button>
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
                onBlock={handleBlock}
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
    </div>
  );
}
