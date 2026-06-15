/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Search, Pencil, Ban, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Pagination } from "@/components/custom/pagination";
import { CreateCategoryModal } from "@/components/custom/modal/create_category";
import { UpdateCategoryModal } from "@/components/custom/modal/update_category";
import { ConfirmationModal } from "@/components/custom/modal/confirmation_modal";
import {
  useGetCategoriesQuery,
  useToggleCategoryStatusMutation,
} from "@/lib/redux/apis/categoryApi";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  image_url: string | null;
  is_active: boolean;
}

const PAGE_SIZE = 28;

function CategoryCard({
  category,
  onToggleStatus,
  onEdit,
}: {
  category: Category;
  onToggleStatus: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-brand-50 border border-gray-100 flex items-center justify-center">
        <img
          src={category.image_url || "/assets/placeholder.png"}
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
          title={category.is_active ? "Set Inactive" : "Set Active"}
          className={`p-1.5 rounded-lg transition-colors ${
            !category.is_active
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = PAGE_SIZE;

  const {
    data: categoriesResponse,
    isLoading,
    refetch,
  } = useGetCategoriesQuery({
    page: currentPage,
    limit,
  });
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories: Category[] = categoriesResponse?.data?.items || [];
  const totalItems = categoriesResponse?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusToggleRequest = (id: number) => {
    setSelectedCategoryId(id);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedCategoryId) {
      try {
        await toggleCategoryStatus(selectedCategoryId).unwrap();
        toast.success("Category status updated successfully");
        setIsStatusModalOpen(false);
      } catch (error) {
        toast.error("Failed to update category status");
      }
    }
  };

  const handleEdit = (id: number) => {
    setSelectedCategoryId(id);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[600px] flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-2xl">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        </div>
      )}

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
        <Button
          className="gap-2 rounded-full"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Add New Category
        </Button>
      </div>

      <div className="flex-1">
        {filtered.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onToggleStatus={handleStatusToggleRequest}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={refetch}
      />

      {selectedCategory && (
        <>
          <UpdateCategoryModal
            isOpen={isUpdateModalOpen}
            onOpenChange={setIsUpdateModalOpen}
            categoryId={selectedCategory.id}
            initialData={{ name: selectedCategory.name }}
          />
          <ConfirmationModal
            isOpen={isStatusModalOpen}
            onOpenChange={setIsStatusModalOpen}
            title={selectedCategory.is_active ? "Set Inactive" : "Set Active"}
            description={`Are you sure you want to set ${selectedCategory.name} to ${selectedCategory.is_active ? "inactive" : "active"}?`}
            onConfirm={confirmStatusChange}
            confirmLabel={
              selectedCategory.is_active ? "Set Inactive" : "Set Active"
            }
            variant={selectedCategory.is_active ? "destructive" : "default"}
          />
        </>
      )}
    </div>
  );
}
