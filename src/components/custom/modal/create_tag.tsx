/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { z } from "zod";
import { useCreateTagMutation } from "@/lib/redux/apis/tagApi";
import { toast } from "sonner";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormValues = z.infer<typeof tagSchema>;

export function CreateTagModal() {
  const [open, setOpen] = useState(false);
  const [createTag, { isLoading }] = useCreateTagMutation();

  const onSubmit = async (data: TagFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);

    try {
      await createTag(formData).unwrap();
      toast.success("Tag created successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.data?.detail || "Failed to create tag");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
