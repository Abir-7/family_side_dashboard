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
import { z } from "zod";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).optional(),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

const CATEGORY_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Nursery", value: "Nursery" },
  { label: "Playground", value: "Playground" },
  { label: "Sports", value: "Sports" },
];

interface UpdateSubCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: { name: string; category: string };
}

export function UpdateSubCategoryModal({
  isOpen,
  onOpenChange,
  initialData,
}: UpdateSubCategoryModalProps) {
  const onSubmit = (data: SubCategoryFormValues) => {
    console.log("Update Sub-Category:", data);
    onOpenChange(false);
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
            name="category"
            label="Select Category"
            placeholder="Select a category"
            options={CATEGORY_OPTIONS}
          />

          <FormImageUpload name="images" label="Sub-Category Logo" optional />

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
