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
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.instanceof(File)).optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: { name: string };
}

export function UpdateCategoryModal({ isOpen, onOpenChange, initialData }: UpdateCategoryModalProps) {
  const onSubmit = (data: CategoryFormValues) => {
    console.log("Update Category:", data);
    onOpenChange(false);
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

          <FormImageUpload name="images" label="Category Logo" optional />

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-full">Update</Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
