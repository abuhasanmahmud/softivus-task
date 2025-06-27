import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows?: number;
  columns?: number;
};

export function LoadingSkeleton({ rows = 5, columns = 6 }: Props) {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="w-full">
        {/* Table Head Skeleton */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b bg-muted">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-6 gap-4 px-4 py-3 border-b"
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
