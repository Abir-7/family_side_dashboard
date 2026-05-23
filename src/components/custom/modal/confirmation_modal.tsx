import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: "default" | "destructive";
}

export function ConfirmationModal({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  variant = "default",
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">{description}</p>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="rounded-full"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
