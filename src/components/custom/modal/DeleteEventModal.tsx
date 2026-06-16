import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  onConfirm: () => void;
}

export function DeleteEventModal({
  isOpen,
  onOpenChange,
  eventName,
  onConfirm,
}: DeleteEventModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-3xl border-none">
        <div className="relative p-6 text-center">
          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full flex items-center justify-center bg-red-50">
              <div className="h-14 w-14 rounded-full flex items-center justify-center bg-red-100">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              Delete Event
            </h3>
            <p className="text-sm text-gray-500 px-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{eventName}</span>?{" "}
              This action cannot be undone and will permanently remove the event.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="w-full h-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Yes, Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-12 rounded-full text-gray-500 font-medium hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
