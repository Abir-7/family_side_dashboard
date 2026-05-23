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
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { Plus } from "lucide-react";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.instanceof(File)).min(1, "Image is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CreateCategoryModal() {
  const onSubmit = (data: CategoryFormValues) => {
    console.log("Create Category:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 px-4 rounded-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold gap-1.5 shadow-none">
          Create category
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
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
