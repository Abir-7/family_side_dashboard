import { Ban, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BlockUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  isSuspended: boolean;
  onConfirm: () => void;
}

export function BlockUserModal({
  isOpen,
  onOpenChange,
  userName,
  isSuspended,
  onConfirm,
}: BlockUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-3xl border-none">
        <div className="relative p-6 text-center">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center ${isSuspended ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`h-14 w-14 rounded-full flex items-center justify-center ${isSuspended ? 'bg-green-100' : 'bg-red-100'}`}>
                <Ban className={`h-7 w-7 ${isSuspended ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              {isSuspended ? "Unsuspend User" : "Suspend User"}
            </h3>
            <p className="text-sm text-gray-500 px-4">
              Are you sure you want to {isSuspended ? "unsuspend" : "suspend"}{" "}
              <span className="font-semibold text-gray-900">{userName}</span>?{" "}
              {isSuspended 
                ? "This will restore their access to the platform." 
                : "This will temporarily restrict their access to the platform."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={`w-full h-12 rounded-full text-white font-semibold ${
                isSuspended 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isSuspended ? "Yes, Unsuspend" : "Yes, Suspend"}
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
