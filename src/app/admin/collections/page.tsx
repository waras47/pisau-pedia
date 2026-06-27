import Link from "next/link";

import { accessories, engravings, japaneseKnives } from "@/entities/product";

const collections = [
  { name: "Japanese Knives", handle: "japanese-knives", count: japaneseKnives.length, href: "/collections/japanese-knives" },
  { name: "Accessories", handle: "accessories", count: accessories.length, href: "/collections/accessories" },
  { name: "Knife Engravings", handle: "knife-engravings", count: engravings.length, href: "/collections/knife-engravings" },
];

export default function CollectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Collections</h1>
        <p className="text-sm text-gray-400">Manage product collections</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {collections.map((c) => (
          <div key={c.handle} className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
            <p className="mt-1 text-sm text-gray-400">{c.count} products</p>
            <Link
              href={c.href}
              className="mt-4 inline-block text-xs font-medium text-emerald-500 hover:underline"
              target="_blank"
            >
              View in store →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
