import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlaggedItem {
  id: number;
  image: string;
  title: string;
  type: "Event" | "Activity" | "Post";
  reason: string;
  time: string;
}

interface RecentFlaggedItemsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: FlaggedItem[];
}

export function RecentFlaggedItemsModal({
  isOpen,
  onOpenChange,
  items,
}: RecentFlaggedItemsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Recent flagged items
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {item.title}
                  </span>
                  <Badge className="bg-green-100 text-green-600 border-0 rounded-full text-[10px] px-2 py-0 font-medium shrink-0">
                    {item.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{item.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-gray-400">{item.time}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
