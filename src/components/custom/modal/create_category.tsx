/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/lib/redux/apis/categoryApi";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.instanceof(File)).min(1, "Image is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CreateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCategoryModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onSubmit = async (data: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.images.length > 0) {
      formData.append("image", data.images[0]); // Updated to 'image' as requested
    }

    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.log();
      console.error("Create category error:", error?.data);
      toast.error(
        error?.data?.detail || "An error occurred while creating the category",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <FormWrapper<CategoryFormValues>
          onSubmit={onSubmit}
          schema={categorySchema}
          defaultValues={{ name: "", images: [] }}
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
            <Button type="submit" className="rounded-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
