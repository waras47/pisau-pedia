"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { listProducts, type ProductApiItem } from "@/entities/product/api/product.api";

import { useLocaleCurrency } from "@/features/locale-currency";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const DEBOUNCE_MS = 300;
const PREVIEW_LIMIT = 6;

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { formatPrice } = useLocaleCurrency();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      // Wait for the modal to mount before focusing.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      listProducts({ search: query, perPage: PREVIEW_LIMIT })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  function goToResults() {
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl border border-border bg-background shadow-xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToResults();
          }}
          className="flex items-center gap-3 border-b border-border px-4 py-3"
        >
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pisau, aksesoris..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Mencari...</p>
          ) : query.trim() && results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Tidak ada produk yang cocok dengan &quot;{query}&quot;.
            </p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted"
                  >
                    {p.image ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 shrink-0 bg-muted" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {query.trim() ? (
          <button
            type="button"
            onClick={goToResults}
            className="block w-full border-t border-border px-4 py-3 text-center text-sm font-medium text-accent hover:bg-muted"
          >
            Lihat semua hasil untuk &quot;{query}&quot;
          </button>
        ) : null}
      </div>
    </div>
  );
}
