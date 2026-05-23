import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Plus } from "lucide-react";
import { z } from "zod";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).min(1, "Image is required"),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

const CATEGORY_OPTIONS = [
  { label: "Doctor", value: "Doctor" },
  { label: "Nursery", value: "Nursery" },
  { label: "Playground", value: "Playground" },
  { label: "Sports", value: "Sports" },
];

export function CreateSubCategoryModal() {
  const onSubmit = (data: SubCategoryFormValues) => {
    console.log("Create Sub-Category:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 px-4 rounded-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold gap-1.5 shadow-none">
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
          defaultValues={{ name: "", category: "", images: [] }}
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

          <FormImageUpload name="images" label="Sub-Category Logo" />

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-full">Create</Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
