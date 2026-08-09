import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function StoreLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <Skeleton className="h-[80vh] w-full rounded-none lg:h-[640px]" />

      {/* Category banners skeleton */}
      <Container className="py-16">
        <Skeleton className="mx-auto mb-10 h-7 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </Container>

      {/* Featured products skeleton */}
      <Container className="py-16">
        <Skeleton className="mx-auto mb-10 h-7 w-56" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
