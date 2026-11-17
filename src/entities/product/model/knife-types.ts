// Category slugs that make up the storefront-level "knives" grouping
// (/collections/knives and the homepage Japanese Knives row). A product
// belongs to exactly one category, so "knives" aggregates every knife-type
// category rather than mapping to a single row.
export const KNIFE_TYPE_SLUGS = [
  "gyuto",
  "k-tip-gyuto",
  "slicer",
  "petty",
  "deba",
  "bunka",
  "yanagiba",
  "honesuki",
  "kiritsuke",
  "taiwan",
  "santoku",
  "nakiri",
] as const;
