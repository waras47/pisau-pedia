import { type NavItem } from "./navigation.types";

/**
 * Primary header navigation. Each item with `columns` renders as a mega-menu
 * panel on desktop and an accordion on mobile. Keeping this as data (rather
 * than hard-coded JSX) means the menu structure can move to a CMS later
 * without touching the Header / MegaMenu components.
 */
export const mainNav: NavItem[] = [
  {
    label: "Knives",
    href: "/collections/knives",
    columns: [
      {
        title: "By Type",
        links: [
          { label: "Gyuto — Chef's Knife", href: "/collections/gyuto" },
          { label: "K-Tip Gyuto", href: "/collections/k-tip-gyuto" },
          { label: "Slicer — Slicing", href: "/collections/slicer" },
          { label: "Bunka — Multi-Purpose", href: "/collections/bunka" },
          { label: "Petty — Paring", href: "/collections/petty" },
          { label: "Deba — Fish & Bone", href: "/collections/deba" },
          { label: "Yanagiba — Sashimi", href: "/collections/yanagiba" },
          { label: "Honesuki — Deboning", href: "/collections/honesuki" },
          { label: "Kiritsuke", href: "/collections/kiritsuke" },
          { label: "Taiwan Tuna", href: "/collections/taiwan" },
        ],
      },
      {
        title: "By Usage",
        links: [
          { label: "Multi-Purpose", href: "/collections/multi-purpose" },
          { label: "Slicing & Sashimi", href: "/collections/slicing" },
        ],
      },
      {
        title: "Components",
        links: [
          { label: "Knife Blades", href: "/collections/knife-blades" },
          { label: "Knife Handles", href: "/collections/knife-handles" },
        ],
      },
      {
        title: "Collections",
        links: [
          { label: "Bestsellers", href: "/collections/bestsellers" },
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "On Sale", href: "/collections/sale" },
          { label: "Knife Sets", href: "/collections/sets" },
        ],
      },
    ],
  },
  {
    label: "Sharpening",
    href: "/collections/sharpening",
    columns: [
      {
        title: "Stones",
        links: [
          { label: "Sharpening Stones", href: "/collections/sharpening-stones" },
          { label: "Diamond Stones", href: "/collections/diamond-stones" },
          { label: "Flattening Stones", href: "/collections/flattening-stones" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Stone Holders", href: "/collections/stone-holders" },
          { label: "Leather Strops", href: "/collections/strops" },
          { label: "Honing Rods", href: "/collections/honing-rods" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Sharpening & Repairs", href: "/pages/sharpening-repairs" },
          { label: "Knife Engravings", href: "/pages/engraving-request" },
        ],
      },
    ],
  },
  {
    label: "Accessories",
    href: "/collections/accessories",
    columns: [
      {
        title: "Knife Care",
        links: [
          { label: "Cutting Boards", href: "/collections/cutting-boards" },
          { label: "Knife Bags & Rolls", href: "/collections/knife-bags" },
          { label: "Knife Holders", href: "/collections/knife-holders" },
        ],
      },
      {
        title: "Kitchen Tools",
        links: [
          { label: "Peelers & Graters", href: "/collections/peelers" },
          { label: "Kitchen Scissors", href: "/collections/scissors" },
          { label: "Chopsticks", href: "/collections/chopsticks" },
        ],
      },
    ],
  },
  {
    label: "Configurator",
    href: "/pages/configurator",
  },
  {
    label: "Learn",
    href: "/blogs/journal",
    columns: [
      {
        title: "Guides",
        links: [
          { label: "Knife Types", href: "/blogs/knife-types" },
          { label: "Sharpening Guide", href: "/blogs/sharpening-guide" },
          { label: "Steel & Care", href: "/blogs/steel-care" },
        ],
      },
    ],
  },
];
