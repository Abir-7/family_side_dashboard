import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { Plus, Loader2 } from "lucide-react";
import { z } from "zod";
import { useGetCategoriesQuery, useCreateSubCategoryMutation } from "@/lib/redux/apis/categoryApi";
import { toast } from "sonner";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).min(1, "Image is required"),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

export function CreateSubCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categoriesResponse, isLoading: categoriesLoading } = useGetCategoriesQuery({ page: 1, limit: 100 });
  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();

  const categories = categoriesResponse?.data?.items || [];
  const CATEGORY_OPTIONS = categories.map((cat: any) => ({
    label: cat.name,
    value: cat.id.toString(),
  }));

  const onSubmit = async (data: SubCategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category_id", data.category_id);
    if (data.images.length > 0) {
      formData.append("image", data.images[0]);
    }

    try {
      await createSubCategory(formData).unwrap();
      toast.success("Sub-category created successfully");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Create sub-category error:", error);
      toast.error(error.data?.message || "Failed to create sub-category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-4 rounded-full bg-brand-400 hover:bg-brand-500 text-white text-sm font-semibold gap-1.5 shadow-none">
          Create sub-category
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Sub-Category</DialogTitle>
        </DialogHeader>

        <FormWrapper<SubCategoryFormValues>
          onSubmit={onSubmit}
          schema={subCategorySchema}
          defaultValues={{ name: "", category_id: "", images: [] }}
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

          <FormImageUpload name="images" label="Sub-Category Logo" />

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="outline" 
                className="rounded-full"
                onClick={() => setIsOpen(false)}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                className="rounded-full" 
                disabled={isCreating}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
