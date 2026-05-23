import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ─── Page number helper ───────────────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total - 2, total - 1, total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Pagination Component ─────────────────────────────────────────────────────
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-500 disabled:text-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
      >
        <span className="text-base">←</span> Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 text-center text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                currentPage === p
                  ? "bg-brand-400 text-white"
                  : "text-gray-500 hover:bg-gray-100",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-500 disabled:text-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
      >
        Next <span className="text-base">→</span>
      </button>
    </div>
  );
}
