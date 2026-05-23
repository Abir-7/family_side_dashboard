import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/custom/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubCategory {
  id: number;
  name: string;
  category: string; // The category it belongs to
  logo: string;
  blocked: boolean;
}

const ALL_SUBCATEGORIES: SubCategory[] = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  name: "Sub-Category Name",
  category: ["Doctor", "Nursery", "Playground", "Sports"][i % 4],
  logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${i + 1}`,
  blocked: false,
}));

const PAGE_SIZE = 28;

function SubCategoryCard({
  subCategory,
  onBlock,
  onDelete,
  onEdit,
}: {
  subCategory: SubCategory;
  onBlock: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-rose-50 border border-gray-100 flex items-center justify-center">
        <img
          src={subCategory.logo}
          alt={subCategory.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="flex-1 truncate">
        <p className="text-sm text-gray-700 font-medium truncate">{subCategory.name}</p>
        <p className="text-xs text-gray-400 truncate">{subCategory.category}</p>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onBlock(subCategory.id)}
          title={subCategory.blocked ? "Unblock" : "Block"}
          className={`p-1.5 rounded-lg transition-colors ${
            subCategory.blocked
              ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
              : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button
          onClick={() => onDelete(subCategory.id)}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button
          onClick={() => onEdit(subCategory.id)}
          title="Edit"
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(ALL_SUBCATEGORIES);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = subCategories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
    setSubCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, blocked: !c.blocked } : c)),
    );
  };

  const handleDelete = (id: number) => {
    setSubCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (id: number) => {
    console.log("Edit sub-category", id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                    placeholder="Search sub-category"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 h-9 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
                />
            </div>
            <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-40 rounded-full border-gray-200 text-sm text-gray-600">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nursery">Nursery</SelectItem>
                    <SelectItem value="Playground">Playground</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button className="h-9 px-4 rounded-lg bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold gap-1.5 shadow-none">
          Create sub-category
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1">
        {paginated.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No sub-categories found.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {paginated.map((cat) => (
              <SubCategoryCard
                key={cat.id}
                subCategory={cat}
                onBlock={handleBlock}
                onDelete={handleDelete}
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
    </div>
  );
}
