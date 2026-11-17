import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function CartLoading() {
  return (
    <Container className="py-10">
      <Skeleton className="mb-8 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24 shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </Container>
  );
}
