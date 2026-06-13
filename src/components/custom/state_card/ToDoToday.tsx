// components/dashboard/ToDoToday.tsx
import { useState } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToDoTodayModal, type TodoItem } from "@/components/custom/modal/ToDoTodayModal";

export function ToDoToday({ items = [] }: { items?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processedItems: TodoItem[] = items.map(item => ({
    id: item.id,
    count: 1, // API gives a list of items, so each row is 1 item in this context? 
    // Wait, the API response shows: "pending_todo": [{"id": 12, "name": "Little Stars Play Center New", "item_type": "Activity"}]
    // The UI expected a summary: {count: 12, title: "Pending approvals", subtitle: "Actives & Events"}
    // If the API gives individual items, I should probably show them.
    title: item.name,
    subtitle: item.item_type,
  }));

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">To do today</h2>
            <Badge className="bg-brand-400 text-white hover:bg-brand-400 border-0 rounded-full text-xs px-2 py-0 font-semibold h-5 min-w-5 flex items-center justify-center">
              {items.length}
            </Badge>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium text-brand-400 underline underline-offset-2 hover:text-brand-500"
          >
            View all
          </button>
        </div>

        {/* Items */}
        <div className="flex flex-col divide-y divide-gray-50">
          {processedItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-4 py-3.5 hover:bg-gray-50/60 transition-colors -mx-1 px-1 rounded-xl"
            >
              {/* Clock Icon */}
              <div className="h-10 w-10 rounded-full border-2 border-brand-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-brand-400" />
              </div>

              {/* Count + Text */}
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

              {/* Chevron */}
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No pending tasks</p>
          )}
        </div>
      </div>
      <ToDoTodayModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        items={processedItems as any}
      />
    </>
  );
}
