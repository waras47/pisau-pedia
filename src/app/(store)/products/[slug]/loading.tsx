import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function ProductLoading() {
  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-4 h-20 w-full" />
          <Skeleton className="mt-4 h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}
