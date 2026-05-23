import { useState } from "react";
import { Search, Pencil, Trash2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Pagination } from "@/components/custom/pagination";
import { CreateCategoryModal } from "@/components/custom/modal/create_category";
import { UpdateCategoryModal } from "@/components/custom/modal/update_category";
import { ConfirmationModal } from "@/components/custom/modal/confirmation_modal";

interface Category {
  id: number;
  name: string;
  logo: string;
  active: boolean;
}

const ALL_CATEGORIES: Category[] = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  name: `Category ${i + 1}`,
  logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${i + 1}`,
  active: true,
}));

const PAGE_SIZE = 28;

function CategoryCard({
  category,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  category: Category;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-brand-50 border border-gray-100 flex items-center justify-center">
        <img
          src={category.logo}
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <span className="flex-1 text-sm text-gray-700 font-medium truncate">
        {category.name}
      </span>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onToggleStatus(category.id)}
          title={category.active ? "Set Inactive" : "Set Active"}
          className={`p-1.5 rounded-lg transition-colors ${
            !category.active
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        <button
          onClick={() => onDelete(category.id)}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        <button
          onClick={() => onEdit(category.id)}
          title="Edit"
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(ALL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (id: number) => {
    setSelectedCategoryId(id);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedCategoryId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCategoryId ? { ...c, active: !c.active } : c)),
      );
    }
  };

  const handleDelete = (id: number) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategoryId) {
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategoryId));
    }
  };

  const handleEdit = (id: number) => {
    setSelectedCategoryId(id);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search category"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
          />
        </div>
        <CreateCategoryModal />
      </div>

      <div className="flex-1">
        {paginated.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {paginated.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onToggleStatus={handleStatusChange}
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

      {selectedCategory && (
        <>
          <UpdateCategoryModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            initialData={{ name: selectedCategory.name }}
          />
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title="Delete Category"
            description={`Are you sure you want to delete ${selectedCategory.name}? This action cannot be undone.`}
            onConfirm={confirmDelete}
            confirmLabel="Delete"
            variant="destructive"
          />
          <ConfirmationModal
            isOpen={isStatusModalOpen}
            onOpenChange={setIsStatusModalOpen}
            title={selectedCategory.active ? "Set Inactive" : "Set Active"}
            description={`Are you sure you want to set ${selectedCategory.name} to ${selectedCategory.active ? "inactive" : "active"}?`}
            onConfirm={confirmStatusChange}
            confirmLabel={selectedCategory.active ? "Set Inactive" : "Set Active"}
            variant={selectedCategory.active ? "destructive" : "default"}
          />
        </>
      )}
    </div>
  );
}
