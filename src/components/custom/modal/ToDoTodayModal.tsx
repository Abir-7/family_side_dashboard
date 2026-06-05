import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Clock } from "lucide-react";

interface TodoItem {
  id: number;
  count: number;
  title: string;
  subtitle: string;
}

interface ToDoTodayModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: TodoItem[];
}

export function ToDoTodayModal({
  isOpen,
  onOpenChange,
  items,
}: ToDoTodayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            To do today
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2 flex flex-col divide-y divide-gray-100">
          {items.map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-4 py-3.5 hover:bg-gray-50/60 transition-colors -mx-1 px-1 rounded-xl"
            >
              <div className="h-10 w-10 rounded-full border-2 border-brand-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex items-center gap-3 flex-1 text-left">
                <span className="text-2xl font-bold text-gray-800 leading-none w-7 shrink-0">
                  {item.count}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
