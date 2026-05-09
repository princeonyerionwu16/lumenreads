export function BookGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden glass">
          <div className="aspect-[2/3] bg-secondary shimmer" />
          <div className="p-4 space-y-2">
            <div className="h-4 rounded bg-secondary shimmer" />
            <div className="h-3 w-2/3 rounded bg-secondary shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
