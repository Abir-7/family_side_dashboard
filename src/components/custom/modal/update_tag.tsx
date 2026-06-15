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
import { useUpdateTagMutation } from "@/lib/redux/apis/tagApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface UpdateTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: number;
  initialData: { name: string };
}

export function UpdateTagModal({
  isOpen,
  onOpenChange,
  tagId,
  initialData,
}: UpdateTagModalProps) {
  const [updateTag, { isLoading }] = useUpdateTagMutation();

  const onSubmit = async (data: TagFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    
    try {
        await updateTag({ id: tagId, formData }).unwrap();
        toast.success("Tag updated successfully");
        onOpenChange(false);
    } catch (error: any) {
        toast.error(error.data?.message || "Failed to update tag");
    }
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
            <Button type="submit" className="rounded-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
            </Button>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}
