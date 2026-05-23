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
import { Plus } from "lucide-react";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormValues = z.infer<typeof tagSchema>;

export function CreateTagModal() {
  const onSubmit = (data: TagFormValues) => {
    console.log("Create Tag:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 px-4 rounded-full bg-brand-400 hover:bg-brand-500 text-white text-sm font-semibold gap-1.5 shadow-none">
          Create tag
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>

        <FormWrapper<TagFormValues>
          onSubmit={onSubmit}
          schema={tagSchema}
          defaultValues={{ name: "" }}
          className="space-y-4"
        >
          <FormInput
            name="name"
            label="Tag Name"
            placeholder="Enter tag name"
          />

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
