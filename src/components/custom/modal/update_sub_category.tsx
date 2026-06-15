import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useGetAllCategoriesQuery, useUpdateSubCategoryMutation } from "@/lib/redux/apis/categoryApi";
import { toast } from "sonner";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).optional(),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

interface UpdateSubCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subCategoryId: number;
  initialData: { name: string; category_id: string };
}

export function UpdateSubCategoryModal({
  isOpen,
  onOpenChange,
  subCategoryId,
  initialData,
}: UpdateSubCategoryModalProps) {
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();

  const categories = categoriesResponse?.data || [];
  const CATEGORY_OPTIONS = categories.map((cat: any) => ({
    label: cat.name,
    value: cat.id.toString(),
  }));

  const onSubmit = async (data: SubCategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category_id", data.category_id);
    if (data.images && data.images.length > 0) {
      formData.append("image", data.images[0]);
    }

    try {
      await updateSubCategory({ id: subCategoryId, formData }).unwrap();
      toast.success("Sub-category updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update sub-category error:", error);
      toast.error(error.data?.message || "Failed to update sub-category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Sub-Category</DialogTitle>
        </DialogHeader>

        <FormWrapper<SubCategoryFormValues>
          onSubmit={onSubmit}
          schema={subCategorySchema}
          defaultValues={initialData}
          className="space-y-4"
        >
          <FormInput
            name="name"
            label="Sub-Category Name"
            placeholder="Enter sub-category name"
          />

          <FormSelect
            name="category_id"
            label="Select Category"
            placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
            options={CATEGORY_OPTIONS}
            disabled={categoriesLoading}
          />

          <FormImageUpload name="images" label="Sub-Category Logo" optional />

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-full" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
