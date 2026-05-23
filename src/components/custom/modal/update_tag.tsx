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
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface UpdateTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: { name: string };
}

export function UpdateTagModal({
  isOpen,
  onOpenChange,
  initialData,
}: UpdateTagModalProps) {
  const onSubmit = (data: TagFormValues) => {
    console.log("Update Tag:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Tag</DialogTitle>
        </DialogHeader>

        <FormWrapper<TagFormValues>
          onSubmit={onSubmit}
          schema={tagSchema}
          defaultValues={initialData}
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
            <Button type="submit" className="rounded-full">Update</Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
