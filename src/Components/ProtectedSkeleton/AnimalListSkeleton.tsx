interface Props {
  count?: number;
}

export default function AnimalListSkeleton({ count = 8 }: Props) {
  const items = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl shadow-md bg-white overflow-hidden animate-pulse"
          aria-hidden="true"
        >
          <div className="h-40 bg-gray-200/80"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-200/80 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200/80 rounded w-1/2 mb-4"></div>

            <div className="flex items-center justify-between gap-3">
              <div className="h-6 bg-gray-200/80 rounded w-24"></div>
              <div className="h-8 bg-gray-200/80 rounded w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}