/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, Loader2, Ban, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/custom/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateSubCategoryModal } from "@/components/custom/modal/create_sub_category";
import { UpdateSubCategoryModal } from "@/components/custom/modal/update_sub_category";
import { ConfirmationModal } from "@/components/custom/modal/confirmation_modal";
import {
  useGetAllCategoriesQuery,
  useGetSubCategoriesQuery,
  useToggleSubCategoryStatusMutation,
} from "@/lib/redux/apis/categoryApi";
import { toast } from "sonner";

interface SubCategory {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  image_url: string | null;
  is_active: boolean;
}

function SubCategoryCard({
  subCategory,
  onToggleStatus,
  onEdit,
}: {
  subCategory: SubCategory;
  onToggleStatus: (id: number) => void;
  onEdit: (subCategory: SubCategory) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-brand-50 border border-gray-100 flex items-center justify-center">
        <img
          src={subCategory.image_url || "/assets/placeholder.png"}
          alt={subCategory.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 truncate">
        <p className="text-sm text-gray-700 font-medium truncate">
          {subCategory.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {subCategory.category_name || "N/A"}
        </p>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onToggleStatus(subCategory.id)}
          title={subCategory.is_active ? "Set Inactive" : "Set Active"}
          className={`p-1.5 rounded-lg transition-colors ${
            !subCategory.is_active
              ? "text-red-500 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button
          onClick={() => onEdit(subCategory)}
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
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 28;

  const [toggleSubCategoryStatus] = useToggleSubCategoryStatusMutation();
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const {
    data: subCategoriesData,
    isLoading,
    refetch,
  } = useGetSubCategoriesQuery(
    { category_id: filterCategory || 0, page: currentPage, limit },
    { skip: !filterCategory },
  );

  const subCategories = subCategoriesData?.data?.items || [];
  const totalPages = subCategoriesData
    ? Math.ceil(subCategoriesData.data.total / limit)
    : 1;

  const selectedSubCategory = subCategories.find(
    (s: SubCategory) => s.id === selectedSubCategoryId,
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusToggleRequest = (id: number) => {
    setSelectedSubCategoryId(id);
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedSubCategoryId) {
      try {
        await toggleSubCategoryStatus(selectedSubCategoryId).unwrap();
        toast.success("Sub-category status updated successfully");
        setIsStatusModalOpen(false);
        refetch();
      } catch (error) {
        toast.error("Failed to update sub-category status");
      }
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setIsUpdateModalOpen(true);
  };

  const filtered = subCategories.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[calc(100vh-115px)]  flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search sub-category"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-11 rounded-full border-gray-200 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>
          <Select
            onValueChange={(v) => {
              setFilterCategory(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="!h-11 w-40 rounded-full border-gray-200 text-sm text-gray-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesResponse?.data?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CreateSubCategoryModal />
      </div>

      <div className="flex-1 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        )}
        {!filterCategory ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Please select a category to view sub-categories.
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No sub-categories found.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filtered.map((cat: any) => (
              <SubCategoryCard
                key={cat.id}
                subCategory={cat}
                onToggleStatus={handleStatusToggleRequest}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {filterCategory && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedSubCategory && (
        <ConfirmationModal
          isOpen={isStatusModalOpen}
          onOpenChange={setIsStatusModalOpen}
          title={selectedSubCategory.is_active ? "Set Inactive" : "Set Active"}
          description={`Are you sure you want to set ${selectedSubCategory.name} to ${selectedSubCategory.is_active ? "inactive" : "active"}?`}
          onConfirm={confirmStatusChange}
          confirmLabel={
            selectedSubCategory.is_active ? "Set Inactive" : "Set Active"
          }
          variant={selectedSubCategory.is_active ? "destructive" : "default"}
        />
      )}

      {editingSubCategory && (
        <UpdateSubCategoryModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          subCategoryId={editingSubCategory.id}
          initialData={{
            name: editingSubCategory.name,
            category_id: editingSubCategory.category_id.toString(),
          }}
        />
      )}
    </div>
  );
}
