"use client";

import { useMemo, useState, useCallback } from "react";
import { Check, ChevronDown, Info, X } from "lucide-react";

import { useTheme } from "next-themes";

import { KnifeOutline, KnifeShapeIcon,type KnifeShapeId } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import {
  accessories as staticAccessories,
  CURRENCY,
  getBladesByShape as staticGetBladesByShape,
  handles as staticHandles,
  shapes as staticShapes,
  type KnifeAccessory,
  type KnifeBlade,
  type KnifeHandle,
  type KnifeShape,
} from "@/entities/configurator";
import { type Product } from "@/entities/product";

import { useCart } from "@/features/cart";
import { useLocaleCurrency } from "@/features/locale-currency";

interface KnifeConfiguratorProps {
  apiShapes?: KnifeShape[];
  apiBlades?: KnifeBlade[];
  apiHandles?: KnifeHandle[];
  apiAccessories?: KnifeAccessory[];
}

export function KnifeConfigurator({
  apiShapes,
  apiBlades,
  apiHandles,
  apiAccessories,
}: KnifeConfiguratorProps = {}) {
  const { addItem } = useCart();
  const { formatPrice } = useLocaleCurrency();
  const { resolvedTheme } = useTheme();

  const [shapeId, setShapeId] = useState<string | null>(null);
  const [bladeId, setBladeId] = useState<string | null>(null);
  const [handleId, setHandleId] = useState<string | null>(null);
  const [accessoryIds, setAccessoryIds] = useState<string[]>([]);
  const [openStep, setOpenStep] = useState(1);
  const [infoBlade, setInfoBlade] = useState<KnifeBlade | null>(null);

  const allShapes = apiShapes !== undefined ? apiShapes : staticShapes;
  const allBlades = apiBlades !== undefined ? apiBlades : [];
  const allHandles = apiHandles !== undefined ? apiHandles : staticHandles;
  const allAccessories = apiAccessories !== undefined ? apiAccessories : staticAccessories;

  const shape = allShapes.find((s) => s.id === shapeId) ?? null;
  const availableBlades = shapeId
    ? (apiBlades !== undefined ? allBlades.filter((b) => b.shapeId === shapeId) : staticGetBladesByShape(shapeId))
    : [];
  const blade = availableBlades.find((b) => b.id === bladeId) ?? null;
  const handle = allHandles.find((h) => h.id === handleId) ?? null;
  const chosenAccessories = allAccessories.filter((a) =>
    accessoryIds.includes(a.id),
  );

  // Sampai langkah mana user boleh membuka (reveal berurutan)
  const maxStep = useMemo(() => {
    if (handle) return 4;
    if (blade) return 3;
    if (shape) return 2;
    return 1;
  }, [shape, blade, handle]);

  const total = useMemo(() => {
    const base = blade?.price ?? 0;
    const handleDelta = handle?.priceDelta ?? 0;
    const acc = chosenAccessories.reduce((sum, a) => sum + a.price, 0);
    return base + handleDelta + acc;
  }, [blade, handle, chosenAccessories]);

  const canAdd = Boolean(shape && blade && handle);

  // — handlers —
  function selectShape(id: string) {
    setShapeId(id);
    setBladeId(null); // blade lama tak valid utk shape baru
    setOpenStep(2);
  }
  function selectBlade(id: string) {
    setBladeId(id);
    setOpenStep(3);
  }
  function selectHandle(id: string) {
    setHandleId(id);
    setOpenStep(4);
  }
  function toggleAccessory(id: string) {
    setAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  function toggleStep(step: number) {
    if (step > maxStep) return; // belum boleh dibuka
    setOpenStep((cur) => (cur === step ? 0 : step));
  }

  // Helper: bungkus 1 komponen jadi Product (item terpisah di cart)
  function componentProduct(
    kind: "blade" | "handle" | "accessory",
    refId: string,
    name: string,
    category: string,
    price: number,
    image?: string,
  ): Product {
    const slug = `${kind}-${refId}`;
    return {
      id: slug,
      slug,
      name,
      category,
      price,
      currency: CURRENCY,
      rating: 0,
      reviewCount: 0,
      image,
      component: { kind, refId },
    };
  }

  function handleAddToCart() {
    if (!shape || !blade || !handle) return;

    // Tiap komponen masuk cart sebagai item TERPISAH
    addItem(
      componentProduct("blade", blade.id, blade.name, "Blade", blade.price, blade.image),
      1,
    );
    addItem(
      componentProduct(
        "handle",
        handle.id,
        `${handle.name} Handle`,
        "Handle",
        handle.priceDelta,
        handle.image,
      ),
      1,
    );
    chosenAccessories.forEach((a) => {
      addItem(
        componentProduct("accessory", a.id, a.name, "Accessory", a.price, a.image),
        1,
      );
    });
  }

  return (
    <div className="pb-20">
      {/* ── Preview sticky ── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <Container className="py-2 sm:py-4">
          <p className="text-center text-xs font-medium uppercase tracking-widest2 text-muted-foreground sm:text-sm">
            Knife Configurator — Build Your Own Knife
          </p>
          <div className="mx-auto mt-1 h-px w-10 bg-border sm:mt-2" />

          <div className="relative mt-3">
            <PreviewBox shape={shape} blade={blade} handle={handle} />

            <div className="mt-2 flex items-center justify-end gap-4">
              {blade ? (
                <span className="text-sm font-semibold">
                  {formatPrice(total, CURRENCY)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => canAdd && handleAddToCart()}
                disabled={!canAdd}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  canAdd
                    ? "text-accent hover:opacity-80"
                    : "cursor-not-allowed text-muted-foreground",
                )}
              >
                Confirm selection
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Langkah-langkah ── */}
      <Container className="mt-6 flex flex-col gap-3 sm:mt-10 sm:gap-4">
        {/* Step 1 — Shape */}
        <StepSection
          step={1}
          title="Select Shape"
          summary={shape ? `${shape.name} [${shape.category}]` : undefined}
          open={openStep === 1}
          reachable={maxStep >= 1}
          onToggle={() => toggleStep(1)}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {allShapes.map((s) => (
              <OptionCard
                key={s.id}
                label={`${s.name} [${s.category}]`}
                previewLabel={s.name}
                image={
                  resolvedTheme === "dark"
                    ? (s.silhouetteDark ?? undefined)
                    : (s.silhouetteLight ?? undefined)
                }
                icon={
                  !s.silhouetteLight
                    ? <KnifeShapeIcon shape={s.id as KnifeShapeId} className="h-14 w-auto text-foreground/80" />
                    : undefined
                }
                active={shapeId === s.id}
                onClick={() => selectShape(s.id)}
              />
            ))}
          </div>
        </StepSection>

        {/* Step 2 — Blade (muncul setelah shape dipilih) */}
        {shape ? (
          <StepSection
            step={2}
            title="Select Blade"
            summary={blade ? blade.name : undefined}
            open={openStep === 2}
            reachable={maxStep >= 2}
            onToggle={() => toggleStep(2)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {availableBlades.map((b) => (
                <OptionCard
                  key={b.id}
                  label={b.name}
                  previewLabel={`${b.steel} · ${b.lengthMm}mm`}
                  image={b.image}
                  price={b.price}
                  compareAtPrice={b.compareAtPrice}
                  active={bladeId === b.id}
                  onClick={() => selectBlade(b.id)}
                  onInfo={b.description ? () => setInfoBlade(b) : undefined}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* Step 3 — Handle (muncul setelah blade dipilih) */}
        {blade ? (
          <StepSection
            step={3}
            title="Select Handle"
            summary={handle ? handle.name : undefined}
            open={openStep === 3}
            reachable={maxStep >= 3}
            onToggle={() => toggleStep(3)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {allHandles.map((h) => (
                <OptionCard
                  key={h.id}
                  label={h.name}
                  previewLabel={h.material}
                  image={h.image}
                  price={h.priceDelta > 0 ? h.priceDelta : undefined}
                  priceIsDelta
                  active={handleId === h.id}
                  onClick={() => selectHandle(h.id)}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* Step 4 — Accessories (opsional, muncul setelah handle dipilih) */}
        {handle ? (
          <StepSection
            step={4}
            title="Add Accessories (optional)"
            summary={
              chosenAccessories.length
                ? chosenAccessories.map((a) => a.name).join(", ")
                : undefined
            }
            open={openStep === 4}
            reachable={maxStep >= 4}
            onToggle={() => toggleStep(4)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {allAccessories.map((a) => (
                <OptionCard
                  key={a.id}
                  label={a.name}
                  previewLabel="Accessory"
                  image={a.image}
                  price={a.price}
                  priceIsDelta
                  active={accessoryIds.includes(a.id)}
                  onClick={() => toggleAccessory(a.id)}
                />
              ))}
            </div>
          </StepSection>
        ) : null}

        {/* CTA akhir */}
        <div className="mt-4 flex flex-col items-center gap-3 border-t border-border pt-6 sm:mt-6 sm:flex-row sm:justify-between sm:pt-8">
          <div>
            <span className="text-xs uppercase tracking-widest2 text-muted-foreground">
              Total
            </span>
            <p className="text-2xl font-semibold">
              {formatPrice(total, CURRENCY)}
            </p>
          </div>
          <Button
            size="lg"
            disabled={!canAdd}
            onClick={handleAddToCart}
            className="w-full sm:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      </Container>

      {/* ── Blade Info Modal ── */}
      {infoBlade ? (
        <BladeInfoModal blade={infoBlade} onClose={() => setInfoBlade(null)} formatPrice={formatPrice} />
      ) : null}
    </div>
  );
}

/* ───────────── sub-komponen ───────────── */

function PreviewBox({
  shape,
  blade,
  handle,
}: {
  shape: KnifeShape | null;
  blade: KnifeBlade | null;
  handle: KnifeHandle | null;
}) {
  return (
    <>
      <style>{`
        .configurator-preview {
          height: 170px;
          overflow: hidden;
        }
        .configurator-preview .knife-img {
          width: calc(100% - 32px);
          left: 16px;
          top: 2px;
        }
        @media (min-width: 640px) {
          .configurator-preview {
            height: 270px;
          }
          .configurator-preview .knife-img {
            width: auto;
            height: 600px;
            top: -180px;
            left: 74px;
          }
        }
      `}</style>
      <div className="configurator-preview relative w-full overflow-hidden bg-muted">
        {!shape ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="http://localhost:9000/pisaupedia/configurator/shapes/preview-outline.png"
            alt="Knife outline"
            className="knife-img absolute opacity-60"
          />
        ) : !blade ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shape.previewImage ?? "/images/configurator/preview-outline.png"}
            alt={`${shape.name} outline`}
            className="knife-img absolute opacity-50"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blade.previewImage ?? blade.image ?? ""}
              alt={blade.name}
              className="knife-img absolute"
            />
            {handle?.previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={handle.previewImage}
                alt={handle.name}
                className="knife-img absolute"
                style={{ zIndex: 1 }}
              />
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

interface StepSectionProps {
  step: number;
  title: string;
  summary?: string;
  open: boolean;
  reachable: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function StepSection({
  step,
  title,
  summary,
  open,
  reachable,
  onToggle,
  children,
}: StepSectionProps) {
  return (
    <section className="border-b border-border pb-4">
      <button
        type="button"
        onClick={onToggle}
        disabled={!reachable}
        className="flex w-full items-center justify-between gap-2 py-3 text-left sm:py-4"
      >
        <span className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
              summary
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted-foreground",
            )}
          >
            {summary ? <Check size={14} /> : step}
          </span>
          <span className="shrink-0 text-xs font-medium uppercase tracking-widest2 sm:text-sm">
            {step}. {title}
          </span>
          {summary && !open ? (
            <span className="truncate text-xs text-muted-foreground sm:text-sm">— {summary}</span>
          ) : null}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? <div className="pt-2">{children}</div> : null}
    </section>
  );
}

interface OptionCardProps {
  label: string;
  previewLabel: string;
  image?: string;
  icon?: React.ReactNode;
  price?: number;
  compareAtPrice?: number;
  priceIsDelta?: boolean;
  active: boolean;
  onClick: () => void;
  onInfo?: () => void;
}

function OptionCard({
  label,
  previewLabel,
  image,
  icon,
  price,
  compareAtPrice,
  priceIsDelta,
  active,
  onClick,
  onInfo,
}: OptionCardProps) {
  const { formatPrice } = useLocaleCurrency();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col gap-1.5 border p-2 text-left transition-colors sm:gap-2 sm:p-3",
        active
          ? "border-accent ring-1 ring-accent"
          : "border-border hover:border-foreground/40",
      )}
    >
      {onInfo ? (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onInfo(); } }}
          className="absolute right-2 top-2 z-10 cursor-pointer text-muted-foreground/60 transition-colors hover:text-foreground sm:right-3 sm:top-3"
        >
          <Info size={14} className="sm:h-4 sm:w-4" />
        </span>
      ) : (
        <Info size={14} className="absolute right-2 top-2 text-muted-foreground/60 sm:right-3 sm:top-3 sm:h-4 sm:w-4" />
      )}
      {icon ? (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted/40">
          {icon}
        </div>
      ) : image ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={previewLabel}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <PlaceholderImage ratio="landscape" label={previewLabel} />
      )}
      <span className="text-[10px] font-medium uppercase leading-tight tracking-widest2 sm:text-xs">
        {label}
      </span>
      {price !== undefined ? (
        <span className="flex flex-wrap items-center gap-1 text-xs sm:gap-2 sm:text-sm">
          <span className="font-semibold text-accent">
            {priceIsDelta ? "+" : ""}
            {formatPrice(price, CURRENCY)}
          </span>
          {compareAtPrice ? (
            <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
              {formatPrice(compareAtPrice, CURRENCY)}
            </span>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}

/* ───────────── Blade Info Modal ───────────── */

function BladeInfoModal({
  blade,
  onClose,
  formatPrice,
}: {
  blade: KnifeBlade;
  onClose: () => void;
  formatPrice: (price: number, currency: string) => string;
}) {
  const [tab, setTab] = useState<"description" | "specifications">("description");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full overflow-y-auto bg-background sm:max-h-[90vh] sm:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        {/* Image */}
        {blade.image ? (
          <div className="aspect-[16/9] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blade.image}
              alt={blade.name}
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}

        {/* Content */}
        <div className="p-6">
          <h3 className="text-sm font-medium uppercase tracking-widest2">
            {blade.name} — Blade
          </h3>

          {/* Tabs */}
          <div className="mt-4 flex gap-6 border-b border-border">
            <button
              type="button"
              onClick={() => setTab("description")}
              className={cn(
                "pb-2 text-sm font-medium uppercase tracking-widest2",
                tab === "description"
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Description
            </button>
            {blade.specifications ? (
              <button
                type="button"
                onClick={() => setTab("specifications")}
                className={cn(
                  "pb-2 text-sm font-medium uppercase tracking-widest2",
                  tab === "specifications"
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Specifications
              </button>
            ) : null}
          </div>

          {/* Tab content */}
          <div className="mt-4">
            {tab === "description" ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {blade.description ?? "No description available."}
              </p>
            ) : blade.specifications ? (
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(blade.specifications).map(([key, val]) => (
                    <tr key={key} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium text-muted-foreground">{key}</td>
                      <td className="py-2">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>

          {/* Price + MORE button */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-accent">
                {formatPrice(blade.price, CURRENCY)}
              </span>
              {blade.compareAtPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(blade.compareAtPrice, CURRENCY)}
                </span>
              ) : null}
            </div>
            {blade.slug ? (
              <a
                href={`/products/${blade.slug}`}
                className="border border-border px-6 py-2 text-sm font-medium uppercase tracking-widest2 transition-colors hover:bg-foreground hover:text-background"
              >
                More
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
