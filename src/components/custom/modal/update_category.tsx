import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { FormInput } from "@/components/forms/FormInput";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { z } from "zod";
import { useUpdateCategoryMutation } from "@/lib/redux/apis/categoryApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.instanceof(File)).optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number;
  initialData: { name: string };
}

export function UpdateCategoryModal({ isOpen, onOpenChange, categoryId, initialData }: UpdateCategoryModalProps) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const onSubmit = async (data: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.images && data.images.length > 0) {
      formData.append("image", data.images[0]);
    }

    try {
      await updateCategory({ id: categoryId, formData }).unwrap();
      toast.success("Category updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update category error:", error);
      toast.error(error.data?.message || "Failed to update category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
        </DialogHeader>

        <FormWrapper<CategoryFormValues>
          onSubmit={onSubmit}
          schema={categorySchema}
          defaultValues={initialData}
          className="space-y-4"
        >
          <FormInput
            name="name"
            label="Category Name"
            placeholder="Enter category name"
          />

          <FormImageUpload name="images" label="Category Logo" />

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="outline" 
                className="rounded-full"
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                className="rounded-full" 
                disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
