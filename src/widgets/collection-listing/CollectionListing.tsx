import { type Product } from "@/entities/product";
import { CollectionToolbar } from "@/features/collection-toolbar";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

interface CollectionListingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
}

export function CollectionListing({
  eyebrow,
  title,
  description,
  products,
}: CollectionListingProps) {
  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <CollectionToolbar products={products} />
      </Container>
    </section>
  );
}
